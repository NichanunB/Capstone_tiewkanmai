import React, { useState, useEffect } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { placeService } from '../../../services/api';

const PlacesBlock = ({ data, onChange }) => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input.trim().length > 0) {
      setLoading(true);
      placeService.searchPlaces(input.trim())
        .then(res => setSearchResults(res.data))
        .catch(() => setSearchResults([]))
        .finally(() => setLoading(false));
    } else {
      setSearchResults([]);
    }
  }, [input]);

  const addPlace = (placeObj) => {
    if (!placeObj) return;
    const exists = (data.places || []).some(p => p.id === placeObj.id);
    if (!exists) {
      onChange({ ...data, places: [...(data.places || []), placeObj] });
    }
    setInput("");
    setShowDropdown(false);
  };

  const removePlace = idx => {
    const newPlaces = [...(data.places || [])];
    newPlaces.splice(idx, 1);
    onChange({ ...data, places: newPlaces });
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <label className="block text-lg font-semibold mb-2">แหล่งท่องเที่ยว</label>
      <div className="flex mb-2 relative">
        <input
          className="flex-1 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ค้นหาสถานที่จากฐานข้อมูลจริง"
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && input.trim().length > 0 && (
          <div className="absolute left-0 top-12 w-full bg-white border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-gray-500">กำลังค้นหา...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-2 text-gray-500">ไม่พบสถานที่</div>
            ) : (
              searchResults.map((place) => (
                <div
                  key={place.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addPlace({ id: place.id, name: place.name })}
                >
                  {place.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(data.places || []).map((place, idx) => (
          <div key={place.id || idx} className="flex items-center bg-white border rounded-lg px-2 py-1">
            <span>{place.name}</span>
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