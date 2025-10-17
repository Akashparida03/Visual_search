import React, { useState } from "react";
import SpinnerIcon from "../components/SpinnerIcon";
import { Link } from "react-router-dom";

export default function AddProduct() {
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData(e.target);
    try {
      //as base url changing so i give it directly
      const response = await fetch("https://visual-product-search-api.onrender.com/product/add", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Failed to add product");

      setMessage({ text: `✅ ${result.message} (ID: ${result.product_id})`, type: "success" });
      e.target.reset();
      setImagePreview(null);
    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Add a New Product</h1>
          <Link to="/" className="text-indigo-600 hover:underline text-sm font-medium">
            ← Back to Search
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input type="number" name="price" step="0.01" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" name="category" required className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows="3" required className="mt-1 block w-full px-3 py-2 border rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <input type="file" name="image" accept="image/*" required onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500" />
              {imagePreview && (
                <img src={imagePreview} className="mt-4 w-full max-h-40 object-cover rounded-lg border-2 border-dashed border-gray-300" alt="Preview" />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md text-white bg-indigo-600"
          >
            {isLoading ? <><SpinnerIcon /> Adding...</> : "Add Product"}
          </button>
          {message.text && (
            <div className={`mt-3 text-center text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </div>
          )}
        </form>
      </main>
    </section>
  );
}
