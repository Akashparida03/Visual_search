import React from "react";

export default function FilterBar({ minScore, setMinScore }) {
  return (
    <div className="bg-white shadow-sm p-3 rounded-lg border mb-6 flex flex-col sm:flex-row items-center justify-between">
      <p className="text-sm text-gray-600 mb-2 sm:mb-0">
        Filter results by minimum similarity: <strong>{minScore}%</strong>
      </p>
      <input
        type="range"
        min="0"
        max="100"
        value={minScore}
        onChange={(e) => setMinScore(e.target.value)}
        className="w-full sm:w-1/2 accent-indigo-600"
      />
    </div>
  );
}
