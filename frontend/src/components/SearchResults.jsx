// src/components/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ResultCard from './ResultCard';
import { placeService } from '../services/api'; // เปลี่ยนจาก MOCK_ATTRACTIONS เป็น placeService

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  // โหลดข้อมูลรายการโปรดจาก localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '{}');
    setFavorites(storedFavorites);
  }, []);

  // บันทึกการเปลี่ยนแปลงรายการโปรด
  const toggleFavorite = (id) => {
    const newFavorites = {
      ...favorites,
      [id]: !favorites[id]
    };
    setFavorites(newFavorites);
    localStorage.setItem('favoriteAttractions', JSON.stringify(newFavorites));
  };

  // ค้นหาด้วย API searchPlaces
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log(`กำลังค้นหาด้วยคำค้นหา: "${searchQuery}"`);
        
        // เรียกใช้ API ค้นหาจริง
        const response = await placeService.searchPlaces(searchQuery);
        console.log("ผลการค้นหา:", response.data);
        
        // แปลงข้อมูลให้ตรงกับรูปแบบที่ต้องการ
        const formattedResults = response.data.map(item => ({
          id: item.id,
          title: item.name || item.title || '-',
          description: item.description || '-',
          image: item.image || item.img || null,
          category: item.category || 'ที่ท่องเที่ยว',
        }));
        
        setResults(formattedResults);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการค้นหา:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="space-y-6 p-4">
      {loading ? (
        <div className="text-center py-10">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      ) : results.length > 0 ? (
        results.map(attraction => (
          <ResultCard 
            key={attraction.id} 
            attraction={attraction}
            isFavorite={!!favorites[attraction.id]}
            onToggleFavorite={toggleFavorite}
          />
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">ไม่พบสถานที่ท่องเที่ยวที่ตรงกับคำค้นหา "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;