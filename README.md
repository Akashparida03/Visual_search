# 🖼️  Visual Product Matcher

This document outlines the architecture of the **Image Similarity Search Application**, describing both the **frontend** and **backend** components and how they interact to deliver image-based product search.

---

## 1. Frontend

The **frontend** provides the user interface for uploading images (via file or URL) and visualizing the matched product results.

### Image Upload and Preview

When a user uploads an image file:

- **File Selection:** The user selects an image using `<input type="file">`.
- **Image Preview:**
  - The **FileReader API** reads the selected file.
  - The `readAsDataURL()` method converts the file into a base64-encoded string (data URL).
  - This data URL is stored in the component’s state.
  - Updating the state triggers a re-render, showing the image preview inside an `<img>` tag.
- **API Request:** The image file (as a File object) is then sent to the **backend API** for processing via `fetch`.

### URL-Based Image Upload

When a user provides an image URL:

- **URL Input:** The user enters the image URL in a text input field.
- **Image Fetching:**
  - The frontend makes a `fetch` request to retrieve the image.
- **Blob Conversion:** The fetched response is converted to a **Blob** object.
- **API Request:** The Blob is sent to the backend API, simulating a standard file upload.

---

## 2. Backend

The **backend** is built using **FastAPI**, and it performs the main logic of identifying similar products from a vector database.

### API Endpoint

A FastAPI endpoint (`/search-image`) handles image uploads:

This endpoint receives the uploaded image file and processes it for similarity search.

### Image Processing and Embedding

- **Model Used:** Pretrained **CLIP** (Contrastive Language–Image Pre-training) model.
- **Workflow:**
  - The image is loaded using Pillow or TorchVision transforms.
  - CLIP encodes the image into a high-dimensional vector (embedding).
  - This vector represents the semantic meaning of the image.


---

### Vector Search with Qdrant

- **Querying Qdrant:**
  - The generated embedding is used to query the **Qdrant vector database**.
- **Similarity Metric:** Cosine similarity is used to find similarity.
- **Results:** Qdrant returns top matching product IDs  with similarity scores.


---

### Data Retrieval from PostgreSQL

- **Metadata Fetching:** Using product IDs from Qdrant, the system queries PostgreSQL for complete metadata.
- **Fields Retrieved:** Product name, description, price, and image URL.


---

### Filtering and Response Construction

- **Similarity Score:** Multiply Qdrant’s score by 100 → percentage format.
- **Threshold Filtering:** Exclude items below the user-specified similarity threshold.
- **Final Response:** Return filtered items as JSON.
-   Product metadata (name, description, category, price)
-   Product image URL
-   Similarity score


---

## 3. Data Flow Summary

1. **User uploads image ➜** Image file or URL processed in frontend.
2. **Frontend ➜ Backend:** Image sent to FastAPI endpoint.
3. **FastAPI ➜ CLIP:** Generate image embedding.
4. **CLIP ➜ Qdrant:** Similarity search returns product IDs.
5. **Qdrant ➜ PostgreSQL:** Fetch product metadata.
6. **Backend ➜ Frontend:** Return JSON of similar items above threshold.

---

## 4. Technology Stack

| Component | Technology |
|------------|-------------|
| Frontend | React.js, Tailwind CSS |
| Backend | FastAPI (Python) |
| Model | OpenAI CLIP |
| Vector DB | Qdrant |
| Relational DB | PostgreSQL |

---
### 5. OUTPUT



