import React, { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";

const PlacesBlock = ({ data, onChange }) => {
  const [input, setInput] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  // Mock favorites data - replace with actual favorites from your data source
  const favorites = [
    "วัดเล่งเน่ยยี่",
    "เยาวราช",
    "ตลาดน้ำอัมพวา",
    "คลองบางหลวง"
  ];

  const addPlace = (place) => {
    if (place.trim()) {
      onChange({ ...data, places: [...(data.places || []), place.trim()] });
      setInput("");
      setShowFavorites(false);
    }
  };

  const removePlace = idx => {
    const newPlaces = [...(data.places || [])];
    newPlaces.splice(idx, 1);
    onChange({ ...data, places: newPlaces });
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <label className="block text-lg font-semibold mb-2">แหล่งท่องเที่ยว</label>
      <div className="flex mb-2">
        <input
          className="flex-1 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="เพิ่มแหล่งท่องเที่ยว"
          onKeyPress={e => e.key === 'Enter' && addPlace(input)}
        />
        <button
          className="ml-2 px-3 py-1 text-white rounded-lg bg-[#3674b5] hover:bg-[#2a5b8e]"
          onClick={() => addPlace(input)}
          type="button"
        >
          +
        </button>
        <div className="relative">
          <button
            className="ml-2 px-2 py-1 text-white rounded-lg bg-[#3674b5] hover:bg-[#2a5b8e] flex items-center gap-1 h-[41.5px]"
            onClick={() => setShowFavorites(!showFavorites)}
            type="button"
          >
            <Heart className="w-3 h-3" />
            <span className="text-xs">รายการโปรด</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFavorites && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-2">
                <div className="text-sm text-gray-500 mb-2 px-2">เลือกจากรายการโปรด</div>
                {favorites.map((favorite, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    onClick={() => addPlace(favorite)}
                  >
                    {favorite}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(data.places || []).map((place, idx) => (
          <div key={idx} className="flex items-center bg-white border rounded-lg px-2 py-1">
            <span>{place}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removePlace(idx)}
              type="button"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesBlock; 