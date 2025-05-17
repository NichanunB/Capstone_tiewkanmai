// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TravelPlanSection from '../components/TravelPlanSection';
import Footer from '../components/Footer';
import { placeService, planService, categoryService, provinceService } from '../services/api';

function Home() {
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // โหลดหมวดหมู่ทั้งหมด
        const categoriesResponse = await categoryService.getAllCategories();
        setCategories(categoriesResponse.data || []);
        
        // โหลดจังหวัดทั้งหมด
        const provincesResponse = await provinceService.getAllProvinces();
        setProvinces(provincesResponse.data || []);
        
        // โหลดสถานที่ท่องเที่ยวแนะนำ
        const placesResponse = await placeService.getAllPlaces();
        setFeaturedPlaces(placesResponse.data || []);

        // โหลดแผนท่องเที่ยวล่าสุด
        const plansResponse = await planService.getAllPublicPlans();
        const publicPlans = plansResponse.data || [];

        // โหลดแผนท่องเที่ยวจาก localStorage
        const localPlans = JSON.parse(localStorage.getItem('userPlans') || '[]');
        
        // รวมแผนท่องเที่ยวทั้งหมดและเรียงตามวันที่สร้างล่าสุด
        const allPlans = [...publicPlans, ...localPlans]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6); // แสดงเพียง 6 แผนล่าสุด

        setRecentPlans(allPlans);
        
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลเริ่มต้น:", error);
        setCategories([]);
        setProvinces([]);
        setFeaturedPlaces([]);
        setRecentPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div className='bg-[#E7F9FF]'>
      <Navbar />
      <HeroSection 
        provinces={provinces}
        categories={categories}
      />
      <TravelPlanSection 
        plans={recentPlans}
        loading={loading}
      />
      <Footer />
    </div>
  );
}

export default Home;