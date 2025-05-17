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

        // โหลดแผนท่องเที่ยวล่าสุด (อาจจะต้องสร้าง API พิเศษสำหรับดึงแผนท่องเที่ยวสาธารณะล่าสุด)
        const plansResponse = await planService.getAllPublicPlans();
        setRecentPlans(plansResponse.data || []);
        
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลเริ่มต้น:", error);
        // หากเกิด error ในการโหลด API จริง ให้ใช้ mock data ที่ import มาโดยตรงเป็น fallback
        // (ต้อง import MOCK_ATTRACTIONS, MOCK_PLANS ฯลฯ เข้ามาใน Home.jsx ด้วย)
        // แต่เนื่องจากตอนนี้ service layer จัดการ mock แล้ว จึงไม่จำเป็นต้องทำที่นี่ซ้ำ
        
        // ตั้งค่า state เป็น array ว่าง เพื่อป้องกัน error ในการ render
        setCategories([]);
        setProvinces([]);
        setFeaturedPlaces([]);
        setRecentPlans([]);

      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Dependencies: [] หมายถึงเรียกครั้งเดียวตอน component mount

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