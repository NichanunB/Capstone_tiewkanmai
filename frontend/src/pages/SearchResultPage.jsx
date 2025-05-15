import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Filters from '../components/Filters';
import ResultCard from '../components/ResultCard';
import ResultTabs from '../components/ResultTabs';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SearchResultPage() {
  const [activeTab, setActiveTab] = useState('กำลังมาแรง');
  const [favorites, setFavorites] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);

  const attractions = [{
    id: 1,
    title: "เยาวราช",
    description: "ย่านจีนอัน อาหารแซบ และบรรยากาศคึกคัก",
    image: "https://via.placeholder.com/300x200",
    category: "ที่เที่ยวแล้ว",
  },
  {
    id: 2,
    title: "วัดเล่งเน่ยยี่",
    description:
      "ni ai wo, wo ai ni, mixue bingcheng tian mimi. ni ai wo, wo ai ni, mixue bingcheng tian mimi. ni ai wo ya, wo ai ni, ni ai wo, wo ai ni, mixue bingcheng tian mimi",
    image: "https://via.placeholder.com/300x200",
    category: "ที่เที่ยวแล้ว",
    isFavorite: true,
  },
  {
    id: 3,
    title: "ถนนข้าวสาร",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "https://via.placeholder.com/300x200",
    category: "ร้านอาหาร",
  },
  {
    id: 4,
    title: "วัดพระแก้ว",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "https://via.placeholder.com/300x200",
    category: "แผนเที่ยว",
  },
  {
    id: 5,
    title: "ตลาดน้ำอัมพวา",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "https://via.placeholder.com/300x200",
    category: "ร้านอาหาร",
  },
  {
    id: 6,
    title: "คลองบางหลวง",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "https://via.placeholder.com/300x200",
    category: "แผนเที่ยว",
  }
];
  const filters = [
    { id: "ชายหาด", label: "ชายหาด" },
    { id: "ทะเล", label: "ทะเล" },
    { id: "เกาะ", label: "เกาะ" },
    { id: "ภูเขา", label: "ภูเขา" },
    { id: "น้ำตก", label: "น้ำตก" },
    { id: "ป่า", label: "ป่า" },
    { id: "ทะเลสาบ", label: "ทะเลสาบ" },
    { id: "สวนสาธารณะ", label: "สวนสาธารณะ" },
    { id: "ทุ่งดอกไม้", label: "ทุ่งดอกไม้" },
    { id: "ถ้ำ", label: "ถ้ำ" },
    { id: "วัด", label: "วัด" },
    { id: "โบราณสถาน", label: "โบราณสถาน" },
    { id: "พิพิธภัณฑ์", label: "พิพิธภัณฑ์" },
    { id: "หอศิลป์", label: "หอศิลป์" },
    { id: "ตลาดนัด", label: "ตลาดนัด" },
    { id: "ถนนคนเดิน", label: "ถนนคนเดิน" },
    { id: "ห้างสรรพสินค้า", label: "ห้างสรรพสินค้า" },
    { id: "คาเฟ่", label: "คาเฟ่" },
    { id: "ร้านอาหาร", label: "ร้านอาหาร" },
    { id: "สถานบันเทิง", label: "สถานบันเทิง (ผับ บาร์)" },
    { id: "สวนสนุก", label: "สวนสนุก" },
    { id: "สวนน้ำ", label: "สวนน้ำ" }
  ];
  const tabs = ['ที่ท่องเที่ยว', 'ร้านอาหาร', 'แผนเที่ยว'];

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const query = useQuery();
  const searchQuery = query.get('q') || 'กรุงเทพมหานคร'; // Default fallback

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  return (
    <div className="bg-[#E7F9FF]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="p-4">
          <h1 className="text-lg text-black">แสดงผลการค้นหา {searchQuery}</h1>
        </div>

        <div className="flex gap-8">
          <Filters 
            selectedFilters={selectedFilters} 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
          
          <div className="bg-white rounded-lg shadow p-6 flex-1">
            <div className="flex-1">
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
            </div>
            <Pagination />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
