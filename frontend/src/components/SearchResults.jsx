import React from 'react';
import ResultCard from './ResultCard';

function SearchResults({ attractions, searchQuery }) {
  // Filter attractions by search query
  const searchQuery = new URLSearchParams(location.search).get('query') || '';
  const filteredAttractions = searchQuery 
    ? attractions.filter(attraction => 
        attraction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : attractions;

  return (
    <div className="space-y-6">
      {filteredAttractions.map(attraction => (
        <ResultCard 
          key={attraction.id} 
          attraction={attraction} 
        />
      ))}
      
      {filteredAttractions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">ไม่พบสถานที่ท่องเที่ยวที่ตรงกับเงื่อนไขของคุณ</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults