import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResultCard = ({ attraction, isFavorite, onToggleFavorite }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://via.placeholder.com/300x200?text=${attraction.title || 'ไม่มีรูป'}`;
  };

  return (
    <div className="flex flex-col md:flex-row border-b py-4 gap-4">
      <div className="md:w-1/4">
        <img 
          src={attraction.image || `https://via.placeholder.com/300x200?text=${attraction.title || 'ไม่มีรูป'}`} 
          alt={attraction.title} 
          className="w-full h-40 object-cover rounded-lg"
          onError={handleImageError}
        />
      </div>
      <div className="md:w-3/4 flex flex-col">
        <div className="flex justify-between">
          <h3 className="font-bold text-xl">{attraction.title}</h3>
          <button 
            onClick={() => onToggleFavorite(attraction.id)}
            className="flex items-center gap-1"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
        <p className="text-gray-700 mt-2 line-clamp-2" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
          {attraction.description}
        </p>
        <div className="mt-auto pt-2">
          <Link to={`/place/${attraction.id}`}>
            <button className="bg-blue-500 text-white px-4 py-1 rounded-lg mt-2 hover:bg-blue-600">
              ดูรายละเอียด
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;