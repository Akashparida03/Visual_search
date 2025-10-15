import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient, models

load_dotenv()

QDRANT_URL =os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("DQDRANT_API_KEY")
COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME")

qdrant_client = QdrantClient(
    url=QDRANT_URL, 
    api_key=QDRANT_API_KEY ,
)

def initialize_qdrant_collection():
    """Safely create collection if it doesn’t exist."""
    try:
        qdrant_client.get_collection(
            collection_name=COLLECTION_NAME,
            # vectors_config={
            #     "image": models.VectorParams(
            #         size=512,
            #         distance=models.Distance.COSINE
            #     )
            # },
        )
        print(f"✅ Qdrant collection '{COLLECTION_NAME}' is ready.")
    except Exception as e:
        print(f"❌ Could not initialize Qdrant collection: {e}")