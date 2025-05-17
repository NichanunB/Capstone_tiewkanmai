// src/components/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import ResultCard from './ResultCard';
import { MOCK_ATTRACTIONS } from '../mockData/mockData'; // ✅ import mock data

function SearchResults() {
  const searchQuery = new URLSearchParams(location.search).get('query') || '';
  const [filteredAttractions, setFilteredAttractions] = useState([]);

  useEffect(() => {
    const results = MOCK_ATTRACTIONS.filter(attraction =>
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attraction.description && attraction.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredAttractions(results);
  }, [searchQuery]);

  return (
    <div className="space-y-6 p-4">
      {filteredAttractions.length > 0 ? (
        filteredAttractions.map(attraction => (
          <ResultCard 
            key={attraction.id} 
            attraction={attraction}
            isFavorite={false}
            onToggleFavorite={() => {}}
          />
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">ไม่พบสถานที่ท่องเที่ยวที่ตรงกับเงื่อนไขของคุณ</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
