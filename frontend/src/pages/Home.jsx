import React, { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import SearchResults from "../components/SearchResults";
import FilterBar from "../components/FilterBar";
import { Link } from "react-router-dom";

export default function Home() {
  const [searchState, setSearchState] = useState({ results: null, error: null });
  const [isLoading, setIsLoading] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const filteredResults =
    searchState.results?.filter((r) => r.similarity * 100 >= minScore) || [];

  return (
    <div className="bg-gray-50 text-gray-800 font-sans flex flex-row">
      {/* ✨ Add flex, flex-col, and items-center to center all content */}
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Visual Product Search
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Find visually similar products by uploading an image.
          </p>
        </header>

        {/* Image Upload Form */}
        {/* You may want to add a width class here, like w-full or max-w-2xl */}
        <ImageUploader
          onSearch={setSearchState}
          setIsLoading={setIsLoading}
          className="w-full max-w-2xl" // Example: Constrain width
        />

        {/* Search Results */}
        <section className="mt-12 w-full max-w-4xl"> {/* Example: Constrain width */}
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Search Results
          </h2>
          {searchState.results && searchState.results.length > 0 && (
            <FilterBar minScore={minScore} setMinScore={setMinScore} />
          )}
          <SearchResults
            searchState={{ ...searchState, results: filteredResults }}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
}
