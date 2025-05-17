import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Filters from '../components/Filters';
import ResultCard from '../components/ResultCard';
import ResultTabs from '../components/ResultTabs';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MOCK_ATTRACTIONS, MOCK_CATEGORIES } from '../mockData/mockData'; // ✅ import mockdata จริง รวมถึง categories

export default function SearchResultPage() {
  const [activeTab, setActiveTab] = useState('ที่ท่องเที่ยว');
  const [favorites, setFavorites] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '{}');
    setFavorites(storedFavorites);
  }, []);

  // Update localStorage whenever favorites state changes
  useEffect(() => {
    localStorage.setItem('favoriteAttractions', JSON.stringify(favorites));
  }, [favorites]);

  // ใช้ mockdata จริง
  const attractions = MOCK_ATTRACTIONS.map(item => ({
    id: item.id,
    title: item.name || item.title || '-',
    description: item.description || '-',
    image: item.coverImage || item.image || `https://placehold.co/300x200?text=${item.name || 'ไม่มีรูป'}`,
    // ตรวจสอบ category ว่าตรงกับ MOCK_CATEGORIES หรือไม่ ถ้าไม่ตรงให้เป็น 'อื่นๆ' หรือ 'ที่ท่องเที่ยว'
    category: MOCK_CATEGORIES.find(cat => cat.name === item.category)?.name || 'ที่ท่องเที่ยว', 
    // isFavorite field in mock data is not used directly here, controlled by state
  }));
  
  // ใช้ MOCK_CATEGORIES สำหรับ filters
  const filters = MOCK_CATEGORIES.map(cat => ({ id: cat.name, label: cat.name }));
  
  // Only 'ที่ท่องเที่ยว' tab
  const tabs = ['ที่ท่องเที่ยว'];

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id] || false // Toggle status, default to false if undefined
    }));
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  
  const query = useQuery();
  const searchQuery = query.get('q') || 'กรุงเทพมหานคร'; // Default fallback

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  // จำลองการโหลดข้อมูล
  useEffect(() => {
    setIsLoading(true);
    // จำลองการโหลดข้อมูลจาก API เป็นเวลา 1 วินาที
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // กรองข้อมูลตามแท็บที่เลือกและ filters ที่เลือก
  const filteredAttractions = attractions.filter(item => {
    // Since only 'ที่ท่องเที่ยว' tab remains, filter for items that should be under this tab
    const isAttractionCategory = item.category !== 'ร้านอาหาร' && item.category !== 'แผนเที่ยว';

    // กรองตาม filters ที่เลือก
    const passCategoryFilter = selectedFilters.length === 0 || selectedFilters.includes(item.category);
    
    return isAttractionCategory && passCategoryFilter; // Combined filters
  });

  return (
    <div className="bg-[#E7F9FF] min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="p-4">
          <h1 className="text-lg text-black">แสดงผลการค้นหา "{searchQuery}"</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Filters 
            selectedFilters={selectedFilters} 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
          
          <div className="bg-white rounded-lg shadow p-6 flex-1">
            <div className="flex-1">
              {/* Render ResultTabs only if there is more than one tab (optional, but good practice if tabs might be added later) */}
              {tabs.length > 1 ? (
                <ResultTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              ) : null} {/* Or you can remove ResultTabs completely if only one tab is always expected */}

              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>กำลังโหลดข้อมูล...</p>
                </div>
              ) : filteredAttractions.length > 0 ? (
                <div className="mt-4">
                  {filteredAttractions.map(attraction => (
                    <ResultCard
                      key={attraction.id}
                      attraction={attraction}
                      isFavorite={!!favorites[attraction.id]} // Pass favorite status from state
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>ไม่พบข้อมูลที่ค้นหา</p>
                </div>
              )}
            </div>
            <Pagination />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}