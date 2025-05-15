import React from 'react';
import PlacesCard from './PlacesCard';

const RecommendedPlaces = ({ places }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4">
      <h2 className="text-xl text-[#3674B5] font-medium mb-4">พิกัดนี้ไม่มีพัง มีแต่ปังแน่นอน</h2>
      <div className="space-y-4">
        {places.map((place) => (
          <PlacesCard
            key={place.id}
            id={place.id}
            title={place.title}
            imageUrl={place.imageUrl}
            location={place.location}
            rating={place.rating}
            tags={place.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlaces;
