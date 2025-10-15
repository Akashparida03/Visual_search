import os
import uuid
import io
from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from PIL import Image
from qdrant_client import models
from database import get_db
from models import Product
from embeddings import embed_image
from qdrant_utils import qdrant_client, COLLECTION_NAME

router = APIRouter()
IMAGES_DIR = "static/images"

@router.post("/add")
async def add_product(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    image: UploadFile = Form(...),
    db: Session = Depends(get_db)
):
    """
    Adds a new product by saving its metadata to PostgreSQL and its
    image embedding to the Qdrant vector database.
    """
    # --- Step 1: Save image and metadata to PostgreSQL ---
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    image_path = os.path.join(IMAGES_DIR, unique_filename)

    content = await image.read()
    pil_image = Image.open(io.BytesIO(content)).convert("RGB")
    pil_image.save(image_path)
    
    # Create the PostgreSQL record
    new_product = Product(
        name=name, price=price, category=category,
        description=description, image_path=unique_filename
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product) # This fetches the new auto-generated ID
    
    # --- Step 2: Generate embedding and save to Qdrant ---
    embedding = embed_image(pil_image)
    
    try:
        # Upsert the vector to Qdrant using the PostgreSQL ID
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                models.PointStruct(
                    id=new_product.id,
                    vector={"image": embedding}, # Use the named vector "image"
                    payload={"image_path": unique_filename}
                )
            ],
            wait=True
        )
    except Exception as e:
        # If saving to Qdrant fails, roll back the PostgreSQL transaction
        # to prevent orphaned data.
        db.delete(new_product)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to save embedding to Qdrant: {e}")

    return {"message": "Product added successfully", "product_id": new_product.id}

