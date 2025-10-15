import io
from fastapi import APIRouter, UploadFile, Form, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from PIL import Image
from database import get_db
from models import Product
from embeddings import embed_image
from qdrant_utils import qdrant_client, COLLECTION_NAME

router = APIRouter()

@router.post("/image")
async def search_by_image(
    request: Request,
    top_k: int = Form(5),
    image: UploadFile = Form(...),
    db: Session = Depends(get_db)
):
    """
    Searches for similar products by:
    1. Generating an embedding for the uploaded image.
    2. Querying Qdrant to get the IDs of the most similar items.
    3. Fetching the full metadata for those IDs from PostgreSQL.
    """
    try:
        content = await image.read()
        pil_image = Image.open(io.BytesIO(content)).convert("RGB")
        
        # --- Step 1: Get query embedding and search Qdrant ---
        query_embedding = embed_image(pil_image)
        
        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=("image", query_embedding), # Search against the named "image" vector
            limit=top_k,
            with_payload=True # Include payload in results
        )
        
        retrieved_ids = [point.id for point in search_results]
        if not retrieved_ids:
            return {"results": []}

        # --- Step 2: Fetch metadata for the retrieved IDs from PostgreSQL ---
        products = db.query(Product).filter(Product.id.in_(retrieved_ids)).all()
        
        # Create a map for efficient lookup and to preserve Qdrant's ranking
        product_map = {product.id: product for product in products}
        
        # --- Step 3: Combine and format the results ---
        base_url = str(request.base_url)
        formatted_results = []
        for point in search_results:
            product_data = product_map.get(point.id)
            if product_data:
                formatted_results.append({
                    "id": product_data.id,
                    "name": product_data.name,
                    "price": product_data.price,
                    "category": product_data.category,
                    "description": product_data.description,
                    "image_url": f"{base_url}static/images/{product_data.image_path}",
                    "similarity": point.score # Cosine similarity score from Qdrant
                })
                
        return {"results": formatted_results}
    except Exception as e:
        # Catch potential errors during processing
        raise HTTPException(status_code=500, detail=f"An error occurred during search: {str(e)}")

