import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Filters from '../components/Filters';
import ResultCard from '../components/ResultCard';
import ResultTabs from '../components/ResultTabs';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SearchResultPage() {
  const [activeTab, setActiveTab] = useState('ที่ท่องเที่ยว');
  const [favorites, setFavorites] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ข้อมูลตัวอย่างที่จะแสดงเสมอ โดยไม่ต้องเรียก API
  const attractions = [{
    id: 1,
    title: "เยาวราช",
    description: "ย่านจีนอัน อาหารแซบ และบรรยากาศคึกคัก",
    image: "https://via.placeholder.com/300x200?text=เยาวราช",
    category: "ที่ท่องเที่ยว",
  },
  {
    id: 2,
    title: "วัดเล่งเน่ยยี่",
    description:
      "วัดจีนที่เก่าแก่ที่สุดในประเทศไทย ตั้งอยู่ในย่านเยาวราช สร้างขึ้นในสมัยรัชกาลที่ 3 เป็นศาสนสถานของชาวจีนที่เข้ามาตั้งรกรากในไทย",
    image: "https://via.placeholder.com/300x200?text=วัดเล่งเน่ยยี่",
    category: "ที่ท่องเที่ยว",
    isFavorite: true,
  },
  {
    id: 3,
    title: "ถนนข้าวสาร",
    description:
      "ถนนสายสั้นๆ ในเขตพระนคร กรุงเทพฯ เป็นแหล่งท่องเที่ยวยอดนิยมของนักท่องเที่ยวชาวต่างชาติ",
    image: "https://via.placeholder.com/300x200?text=ถนนข้าวสาร",
    category: "ที่ท่องเที่ยว",
  },
  {
    id: 4,
    title: "วัดพระแก้ว",
    description:
      "วัดพระศรีรัตนศาสดาราม หรือที่เรียกกันทั่วไปว่า วัดพระแก้ว เป็นวัดที่สำคัญที่สุดในประเทศไทย ตั้งอยู่ในพระบรมมหาราชวัง",
    image: "https://via.placeholder.com/300x200?text=วัดพระแก้ว",
    category: "ที่ท่องเที่ยว",
  },
  {
    id: 5,
    title: "ตลาดน้ำอัมพวา",
    description:
      "ตลาดน้ำยามเย็นและกลางคืนที่มีชื่อเสียงของอำเภอเมืองสมุทรสงคราม เป็นแหล่งท่องเที่ยวชมหิ่งห้อยในยามค่ำคืน",
    image: "https://via.placeholder.com/300x200?text=ตลาดน้ำอัมพวา",
    category: "ร้านอาหาร",
  },
  {
    id: 6,
    title: "คลองบางหลวง",
    description:
      "คลองในเขตธนบุรี กรุงเทพฯ เป็นแหล่งท่องเที่ยวเชิงอนุรักษ์ที่ยังคงรักษาวิถีชีวิตริมน้ำแบบดั้งเดิม",
    image: "https://via.placeholder.com/300x200?text=คลองบางหลวง",
    category: "ที่ท่องเที่ยว",
  }];
  
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

  // กรองข้อมูลตามแท็บที่เลือก
  const filteredAttractions = attractions.filter(item => {
    // กรองตาม tab
    if (activeTab === 'ที่ท่องเที่ยว' && item.category !== 'ร้านอาหาร' && item.category !== 'แผนเที่ยว') {
      return true;
    }
    if (activeTab === 'ร้านอาหาร' && item.category === 'ร้านอาหาร') {
      return true;
    }
    if (activeTab === 'แผนเที่ยว' && item.category === 'แผนเที่ยว') {
      return true;
    }
    
    // ถ้าไม่ตรงกับแท็บใดๆ
    return false;
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
              <ResultTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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
                      isFavorite={favorites[attraction.id] || attraction.isFavorite}
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