import React from 'react';
import { MapPin, Heart, Star } from 'lucide-react';

const PlaceHeader = ({ title, address, rating, tags }) => {
  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`}
    />
  ));

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3674B5]">{title}</h1>
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
      </div>
      <div className="flex items-center text-gray-600 mt-2">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm">{address}</span>
      </div>
      <div className="flex items-center mt-2">
        {stars}
        <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
      </div>
      <div className="flex items-center mt-2">
        <span className="text-sm text-gray-600">หมวดหมู่: </span>
        {tags.map((tag, index) => (
          <span key={index} className="text-sm text-gray-600 ml-1">
            {tag}{index < tags.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PlaceHeader;
