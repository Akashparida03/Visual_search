Image Similarity Search Application Architecture
This document outlines the architecture of the image similarity search application, detailing the frontend and backend components and their interactions.

1. Frontend
The frontend is responsible for the user interface, allowing users to upload an image (either as a file or via a URL) and view the matching product results.

Image Upload and Preview
When a user uploads an image file from their device:

File Selection: The user selects an image file through an input field (<input type="file">).

Image Preview: The FileReader API is used to read the selected file.

The readAsDataURL() method converts the image file into a base64-encoded string (a data URL).

This data URL is stored in the component's state.

The state change triggers a re-render, displaying a preview of the selected image in an <img> tag.

API Request: The image file (as a File object) is sent to the backend API for processing.

URL-based Image Upload
When a user provides an image URL:

URL Input: The user enters an image URL into a text input field.

Image Fetching: The frontend makes a fetch request to the provided URL.

To handle potential CORS issues, this request might be routed through a proxy or require the server hosting the image to have permissive CORS headers.

Blob Conversion: The fetched image response is converted into a Blob object.

API Request: This Blob is then sent to the backend API, simulating a file upload.

2. Backend
The backend is a FastAPI application that handles the core logic of finding similar products based on an input image.

API Endpoint
A FastAPI endpoint is exposed to accept image uploads. This endpoint receives the image as a file.

Image Processing and Embedding
CLIP Model: A pretrained CLIP (Contrastive Language-Image Pre-training) model is used to generate a vector embedding for the uploaded image. This embedding is a numerical representation of the image's semantic content.

Vector Search with Qdrant
Querying Qdrant: The generated image embedding is used to query a Qdrant vector database.

Similarity Search: Qdrant performs a similarity search (e.g., using cosine similarity) to find the vectors in its index that are closest to the query vector.

Retrieving IDs: The search returns a list of product IDs and their corresponding similarity scores for the top matching items.

Data Retrieval from PostgreSQL
Fetching Metadata: The product IDs retrieved from Qdrant are used to query a PostgreSQL database.

Product Details: This query fetches the complete product metadata, such as the product name, description, price, and its own image URL.

Filtering and Response
Similarity Score Calculation: The raw similarity score from Qdrant is multiplied by 100 to convert it into a percentage.

Filtering: This percentage is then compared against the similarity threshold provided by the user through the filter bar on the frontend. Products with a similarity score below the threshold are filtered out.

Final Response: The backend constructs and returns a JSON response containing a list of the filtered, similar products. Each item in the list includes:

Product metadata (name, description, etc.)

Product image URL

Similarity score
