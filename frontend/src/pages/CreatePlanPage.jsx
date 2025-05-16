// src/pages/CreatePlanPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlanEditor from "../components/create-plan/PlanEditor";
import { categoryService, provinceService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CreatePlanPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [error, setError] = useState(null);

    // โหลดข้อมูลหมวดหมู่และจังหวัด
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // โหลดข้อมูลหมวดหมู่
                const categoriesResponse = await categoryService.getAllCategories();
                setCategories(categoriesResponse.data);

                // โหลดข้อมูลจังหวัด
                const provincesResponse = await provinceService.getAllProvinces();
                setProvinces(provincesResponse.data);
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', err);
                setError('ไม่สามารถโหลดข้อมูลได้');
            } finally {
                setLoading(false);
            }
        };

        // ตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือยัง
        if (!user) {
            // ถ้ายังไม่ได้ล็อกอิน ให้ redirect ไปหน้า login
            navigate('/signin?redirect=/create-plan');
            return;
        }

        fetchData();
    }, [user, navigate]);

    return (
        <div className="bg-[#E7F9FF] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <PlanEditor 
                        categories={categories}
                        provinces={provinces}
                    />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default CreatePlanPage;