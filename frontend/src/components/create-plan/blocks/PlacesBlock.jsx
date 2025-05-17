import React, { useState, useEffect } from "react";
import { placeService } from '../../../services/api';

const PlacesBlock = ({ data, onChange }) => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ค้นหาสถานที่เมื่อ input เปลี่ยนแปลง
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (input.trim().length >= 2) {
        searchPlaces(input.trim());
      } else {
        setSearchResults([]);
      }
    }, 500); // ใส่ delay เพื่อลดการเรียก API บ่อยเกินไป

    return () => clearTimeout(searchTimer);
  }, [input]);

  // ฟังก์ชันค้นหาสถานที่
  const searchPlaces = async (query) => {
    if (!query) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await placeService.searchPlaces(query);
      console.log("Search results:", response.data);
      setSearchResults(response.data || []);
    } catch (err) {
      console.error("Error searching places:", err);
      setError("ไม่สามารถค้นหาสถานที่ได้");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // เพิ่มสถานที่ที่เลือกเข้าไปในบล็อก
  const addPlace = (placeObj) => {
    if (!placeObj) return;
    
    // ตรวจสอบว่าสถานที่นี้มีอยู่แล้วหรือไม่
    const exists = (data.places || []).some(p => p.id === placeObj.id);
    
    if (!exists) {
      const newPlaces = [...(data.places || []), {
        id: placeObj.id,
        name: placeObj.name || placeObj.title
      }];
      
      onChange({ ...data, places: newPlaces });
    }
    
    setInput("");
    setShowDropdown(false);
  };

  // ลบสถานที่ออกจากบล็อก
  const removePlace = (idx) => {
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
          onChange={(e) => setInput(e.target.value)}
          placeholder="ค้นหาสถานที่ท่องเที่ยว..."
          onFocus={() => setShowDropdown(true)}
        />
        
        {/* แสดงผลการค้นหา */}
        {showDropdown && input.trim().length >= 2 && (
          <div className="absolute left-0 top-12 w-full bg-white border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-gray-500">กำลังค้นหา...</div>
            ) : error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : searchResults.length === 0 ? (
              <div className="p-2 text-gray-500">ไม่พบสถานที่ที่ตรงกับคำค้นหา</div>
            ) : (
              searchResults.map((place) => (
                <div
                  key={place.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => addPlace(place)}
                >
                  {place.image && (
                    <img 
                      src={place.image} 
                      alt={place.name || place.title} 
                      className="w-10 h-10 object-cover rounded mr-2"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/40';
                      }}
                    />
                  )}
                  <div>
                    <div className="font-medium">{place.name || place.title}</div>
                    {place.province && <div className="text-xs text-gray-500">{place.province}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* แสดงสถานที่ที่เลือกไว้แล้ว */}
      <div className="flex flex-wrap gap-2 mt-2">
        {(data.places || []).map((place, idx) => (
          <div key={place.id || idx} className="flex items-center bg-white border rounded-lg px-3 py-1.5">
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