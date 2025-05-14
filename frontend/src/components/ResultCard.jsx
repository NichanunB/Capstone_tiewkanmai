import { Heart } from 'lucide-react';

export default function ResultCard({ attraction, isFavorite, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-lg mb-4 p-4 flex shadow-sm">
      <div className="w-32 h-24 flex-shrink-0">
        <img 
          src={attraction.image} 
          alt={attraction.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-[#3674B5] font-medium text-lg">{attraction.name}</h3>
          <button onClick={() => onToggleFavorite(attraction.id)} className="focus:outline-none">
            <Heart 
              size={20} 
              fill={isFavorite ? "red" : "none"} 
              color={isFavorite ? "red" : "currentColor"}
            />
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-1">{attraction.description}</p>
        <div className="mt-3">
          <button className="bg-[#3674B5] text-white px-4 py-1 rounded text-sm">Button</button>
        </div>
      </div>
    </div>
  );
}
