import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the model and immediately convert it to half-precision
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").half().to(device)

processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32", use_fast=True)

def embed_image(img: Image.Image):
    """Converts a PIL Image to a 512-dimension vector embedding."""
    inputs = processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        emb = model.get_image_features(**inputs)
    
    # Normalize the embedding
    emb = emb / emb.norm(dim=-1, keepdim=True)
    
    # Return as a standard Python list
    return emb.cpu().numpy().flatten().tolist()
