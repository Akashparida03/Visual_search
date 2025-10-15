import React from "react";

export default function SearchResults({ searchState, isLoading }) {
  const { results, error } = searchState;

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
        <p className="ml-4 text-gray-600">Searching for similar products...</p>
      </div>
    );

  if (error) return <p className="text-center text-red-600 py-8">❌ {error}</p>;
  if (results && results.length === 0)
    return <p className="text-center text-gray-500 py-8">No products found.</p>;
  if (!results)
    return <p className="text-center text-gray-500 py-8">Upload an image to start search.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {results.map((p) => (
        <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transform hover:-translate-y-1 transition-transform duration-300">
          <img src={p.image_url} alt={p.name} className="h-52 w-full object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.category}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-lg font-bold text-gray-900">${p.price.toFixed(2)}</p>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                {(p.similarity * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
