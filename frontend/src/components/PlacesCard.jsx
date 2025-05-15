import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlacesCard = ({ id, title, imageUrl, location, rating, tags }) => {
  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`}
    />
  ));

  return (
    <Link to={`/place/${id}`} className="block">
      <div className="mb-4 bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300">
        <div className="h-40 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-[#3674B5]">{title}</h3>
          <p className="text-gray-500 text-sm my-1">{location}</p>
          <div className="flex items-center">
            <div className="flex">
              {stars}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            <span>หมวดหมู่: {tags.join(', ')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlacesCard;
