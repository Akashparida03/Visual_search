import React, { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import SearchResults from "../components/SearchResults";
import FilterBar from "../components/FilterBar";
import { Link } from "react-router-dom";

export default function Home() {
  const [searchState, setSearchState] = useState({ results: null, error: null });
  const [isLoading, setIsLoading] = useState(false);
  const [minScore, setMinScore] = useState(0);

  // 🔹 Apply similarity filter dynamically
  const filteredResults =
    searchState.results?.filter((r) => (r.similarity * 100) >= minScore) || [];

  return (
    // ✨ Add flex and flex-col to make this a vertical flex container
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">
      {/* ✨ Add flex-grow to make this section expand and fill available space */}
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Visual Product Search</h1>
          <p className="text-lg text-gray-600 mt-2">
            Find visually similar products by uploading an image.
          </p>
        </header>

        {/* Image Upload Form */}
        <ImageUploader onSearch={setSearchState} setIsLoading={setIsLoading} />

        {/* Search Results */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold mb-6 text-center">Search Results</h2>
          {searchState.results && searchState.results.length > 0 && (
            <FilterBar minScore={minScore} setMinScore={setMinScore} />
          )}
          <SearchResults
            searchState={{ ...searchState, results: filteredResults }}
            isLoading={isLoading}
          />
        </section>
      </main>
      
      {/* Optional: A footer will now automatically stick to the bottom */}
      {/* <footer className="text-center p-4 bg-gray-100 border-t">
          Visual Search&copy; 2025
      </footer> 
      */}
    </div>
  );
}
