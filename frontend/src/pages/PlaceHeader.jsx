// src/pages/PlaceHeader.jsx
import React from 'react';

const PlaceHeader = ({ title, address, rating, tags }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 mb-1">{address}</p>
      {rating && (
        <p className="text-yellow-500 font-medium mb-1">⭐ {rating}/5</p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceHeader;
