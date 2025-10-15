import React from 'react';

export default function ProductCard({ item }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                <h3 className="font-bold text-lg truncate text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">${item.price.toFixed(2)}</p>
            </div>
            <div className="px-4 pb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${item.similarity}%` }}></div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-600 dark:text-gray-300">{item.similarity}% match</p>
            </div>
        </div>
    );
}
