import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routers import products, search
from qdrant_utils import initialize_qdrant_collection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure the Qdrant collection is ready when the app starts
    initialize_qdrant_collection()
    yield
    # Code below yield runs on shutdown (if needed)

app = FastAPI(title="Visual Product Search API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create and mount static directory
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(products.router, prefix="/product", tags=["Products"])
app.include_router(search.router, prefix="/search", tags=["Search"])

@app.get("/")
def read_root():
    return {"message": "API is running."}

