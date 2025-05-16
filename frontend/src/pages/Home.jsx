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
  const [, setFeaturedPlaces] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // โหลดหมวดหมู่ทั้งหมด
        const categoriesResponse = await categoryService.getAllCategories();
        setCategories(categoriesResponse.data);
        
        // โหลดจังหวัดทั้งหมด
        const provincesResponse = await provinceService.getAllProvinces();
        setProvinces(provincesResponse.data);
        
        // โหลดสถานที่ท่องเที่ยวแนะนำ (random หรือเอาจาก rate สูงสุด)
        const placesResponse = await placeService.getAllPlaces();
        setFeaturedPlaces(placesResponse.data.slice(0, 6)); // เอา 6 อันแรก
        
        // โหลดแผนท่องเที่ยวล่าสุด (ถ้ามี API เฉพาะ)
        try {
          // อาจจะต้องสร้าง API พิเศษสำหรับดึงแผนท่องเที่ยวสาธารณะล่าสุด
          const plansResponse = await planService.getUserPlans();
          setRecentPlans(plansResponse.data.slice(0, 3)); // เอา 3 อันแรก
        } catch (err) {
          console.warn("ไม่สามารถโหลดแผนท่องเที่ยวได้:", err);
          setRecentPlans([]); // ใช้ค่าเริ่มต้นเป็นอาร์เรย์ว่าง
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลเริ่มต้น:", error);
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