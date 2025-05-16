// src/pages/SearchResultPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { placeService, categoryService } from '../services/api';
import Filters from '../components/Filters';
import ResultCard from '../components/ResultCard';
import ResultTabs from '../components/ResultTabs';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SearchResultPage() {
  const [attractions, setAttractions] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [activeTab, setActiveTab] = useState('ที่ท่องเที่ยว');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';
  const provinceParam = searchParams.get('province') || '';
  const categoryParam = searchParams.get('category') || '';
  
  // ดึงค่า filters จาก backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        const fetchedCategories = response.data.map(category => ({
          id: category.id.toString(),
          label: category.name
        }));
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('ไม่สามารถโหลดหมวดหมู่ได้:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // ดึงข้อมูลการค้นหา
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        // ถ้ามีแค่ searchQuery และไม่มี filter อื่น
        if (searchQuery && selectedFilters.length === 0 && !provinceParam && !categoryParam) {
          response = await placeService.searchPlaces(searchQuery);
          setAttractions(response.data);
          setTotalPages(Math.ceil(response.data.length / 10));
        } else {
          // ถ้ามี filter หมวดหมู่หรือ province/category
          const params = {};
          if (searchQuery) params.q = searchQuery;
          if (provinceParam) params.province = provinceParam;
          // ถ้าเลือก filter หมวดหมู่ ให้ส่ง category param (รองรับหลายอัน)
          if (selectedFilters.length > 0) params.category = selectedFilters.join(',');
          else if (categoryParam) params.category = categoryParam;
          params.page = currentPage;
          params.size = 10;
          response = await placeService.getAllPlaces(params);
          if (response.data.content) {
            setAttractions(response.data.content);
            setTotalPages(response.data.totalPages);
          } else {
            setAttractions(response.data);
            setTotalPages(Math.ceil(response.data.length / 10));
          }
        }
      } catch (err) {
        console.error('ไม่สามารถโหลดผลการค้นหา:', err);
        setError('ไม่สามารถโหลดผลการค้นหาได้');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, provinceParam, categoryParam, selectedFilters, currentPage]);
  
  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    // ตรงนี้อาจจะต้องเพิ่มการบันทึกรายการโปรดลง API
    // ถ้าผู้ใช้ล็อกอินแล้ว
  };
  
  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1); // กลับไปหน้าแรกเมื่อมีการเปลี่ยนฟิลเตอร์
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // ในกรณีที่ API ไม่รองรับการแบ่งหน้า
    // เราจะต้องทำการแบ่งหน้าเอง (client-side)
  };

  // แสดง loading indicator
  if (loading && currentPage === 1) {
    return (
      <div className="bg-[#E7F9FF]">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="p-4">
            <h1 className="text-lg text-black">แสดงผลการค้นหา {searchQuery}</h1>
          </div>
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            filters={categories} 
            onFilterChange={handleFilterChange}
          />
          
          <div className="bg-white rounded-lg shadow p-6 flex-1">
            <div className="flex-1">
              <ResultTabs 
                tabs={['ที่ท่องเที่ยว', 'ร้านอาหาร', 'แผนเที่ยว']} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />

              <div className="mt-4">
                {error && (
                  <div className="text-center py-10">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
                
                {!error && attractions.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">ไม่พบสถานที่ท่องเที่ยวที่ตรงกับเงื่อนไขของคุณ</p>
                  </div>
                )}
                
                {!error && attractions.map(attraction => (
                  <ResultCard
                    key={attraction.id}
                    attraction={{
                      id: attraction.id,
                      title: attraction.name,
                      description: attraction.description || 'ไม่มีคำอธิบาย',
                      image: attraction.image || 'https://via.placeholder.com/300x200',
                      category: attraction.category
                    }}
                    isFavorite={favorites[attraction.id]}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}