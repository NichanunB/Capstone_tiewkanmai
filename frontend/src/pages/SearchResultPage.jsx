import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import Filters from '../components/Filters';
import ResultCard from '../components/ResultCard';
import ResultTabs from '../components/ResultTabs';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SearchResultPage() {
  const [activeTab, setActiveTab] = useState('กำลังมาแรง');
  const [favorites, setFavorites] = useState({});
  const [attractions, setAttractions] = useState([]);

  const filters = [
    { id: "ปักหมุด", label: "ปักหมุด" },
    { id: "ร้านอาหาร", label: "ร้านอาหาร" },
    { id: "คาเฟ่", label: "คาเฟ่" },
    { id: "วัดวาอาราม", label: "วัดวาอาราม" },
    { id: "ช้อปปิ้ง", label: "ช้อปปิ้ง" },
    { id: "ป่าเขา", label: "ป่าเขา" },
  ];
  const tabs = ['ที่ท่องเที่ยว', 'ร้านอาหาร', 'แผนเที่ยว'];
  const selectedFilters = ['ปักหมุด', 'ร้านอาหาร', 'คาเฟ่'];

  const query = useQuery();
  const searchQuery = query.get('query') || 'กรุงเทพมหานคร';

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const res = await axios.get(`/api/places/search?province=${searchQuery}`);
        setAttractions(res.data);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };

    fetchAttractions();
  }, [searchQuery]);

  return (
    <div className="bg-[#E7F9FF]">
      <Navbar />
      <div className="container mx-auto">
        <div className="p-4">
          <h1 className="text-lg text-black">แสดงผลการค้นหา {searchQuery}</h1>
        </div>

        <div className="flex">
          <Filters selectedFilters={selectedFilters} filters={filters} />
          
          <div className="flex-1 ml-4">
            <ResultTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-4">
              {attractions.map(attraction => (
                <ResultCard
                  key={attraction.id}
                  attraction={attraction}
                  isFavorite={favorites[attraction.id]}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            <Pagination />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
