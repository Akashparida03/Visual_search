import React from 'react';

// --- SVG Icons (included in the same file for simplicity) ---

const SpinnerIcon = () => (
    <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

const UploadIcon = () => (
    <svg
        className="w-12 h-12 mx-auto text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
    >
        <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const XCircleIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);


// --- Main Image Uploader Component ---

export default function ImageUploader({ onSearch, setIsLoading }) {
    const [imagePreview, setImagePreview] = React.useState(null);
    const [imageFile, setImageFile] = React.useState(null);
    const [imageURL, setImageURL] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef(null);

    // Function to handle file selection from button or drop
    const processFile = (file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
            setImageURL("");
            setErrorMsg("");
        } else {
            setErrorMsg("Please select a valid image file.");
            clearSelection();
        }
    };

    const handleFileChange = (e) => {
        processFile(e.target.files[0]);
    };

    const handleURLChange = (e) => {
        const url = e.target.value;
        setImageURL(url);
        if (url.trim()) {
            setImagePreview(url); // Show preview from URL directly
            setImageFile(null);
            setErrorMsg("");
        } else {
           if (!imageFile) setImagePreview(null);
        }
    };
    
    const clearSelection = () => {
        setImagePreview(null);
        setImageFile(null);
        setImageURL("");
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    // Drag and Drop Handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    // Helper: Fetch image blob from URL
    const fetchImageBlob = async (url) => {
        try {
            // Using a CORS proxy for development/demonstration.
            // In a real application, you might handle CORS on your server.
            const proxiedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
            const res = await fetch(proxiedUrl);
            if (!res.ok) throw new Error("Unable to fetch image from URL.");
            const blob = await res.blob();
            return new File([blob], "image_from_url.jpg", { type: blob.type });
        } catch (err) {
            console.error(err);
            throw new Error("Invalid image URL or a network/CORS issue occurred.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile && !imageURL.trim()) {
            setErrorMsg("Please upload an image or provide a URL.");
            return;
        }
        
        setIsLoading(true);
        setIsSearching(true);
        setErrorMsg("");

        try {
            let fileToUpload = imageFile;

            if (!fileToUpload && imageURL.trim() !== "") {
                fileToUpload = await fetchImageBlob(imageURL);
            }
            
            if (!fileToUpload) {
                throw new Error("Could not process the image. Please try again.");
            }

            const formData = new FormData();
            formData.append("image", fileToUpload);
            
            // NOTE: The endpoint is a placeholder. Replace with your actual API endpoint.
            const response = await fetch("http://127.0.0.1:8000/search/image", {
                method: "POST",
                body: formData,
            });
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Search request failed.");

            onSearch({ results: result.results, error: null });

        } catch (error) {
            onSearch({ results: [], error: error.message });
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    };

    return (
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 max-w-lg mx-auto w-full transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Visual Product Search</h2>
            <p className="text-gray-500 mb-6 text-sm">Upload an image or drop it here to find similar items.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Image Dropzone */}
                    <div 
                        className={`relative group border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                            isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'
                        }`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    className="w-full h-48 object-contain rounded-lg"
                                    alt="Image Preview"
                                />
                                <button
                                    type="button"
                                    onClick={clearSelection}
                                    className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-transform duration-200 ease-in-out hover:scale-110 shadow-md"
                                    aria-label="Remove image"
                                >
                                   <XCircleIcon />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <UploadIcon />
                                <p className="text-gray-600">
                                    <span className="font-semibold text-indigo-600 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        Click to upload
                                    </span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* "OR" Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs font-medium text-gray-400 uppercase">Or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    
                    {/* Image URL Input */}
                    <div>
                        <label htmlFor="image_url" className="sr-only">Image URL</label>
                        <input
                            id="image_url"
                            type="url"
                            name="image_url"
                            placeholder="Enter image URL (e.g., https://...)"
                            value={imageURL}
                            onChange={handleURLChange}
                            disabled={isSearching}
                            className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSearching || (!imageFile && !imageURL)}
                    className="mt-8 w-full flex justify-center items-center gap-3 py-3 px-4 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isSearching ? (
                        <>
                            <SpinnerIcon /> Searching for products...
                        </>
                    ) : (
                        "Search"
                    )}
                </button>

                {/* Error Message */}
                {errorMsg && (
                    <p className="text-center text-red-600 bg-red-50 p-3 rounded-lg mt-4 text-sm font-medium animate-pulse">
                        {errorMsg}
                    </p>
                )}
            </form>
        </section>
    );
}

