// src/components/TravelPlanSection.jsx
import React from "react";
import Card from "./ui/Card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TravelPlanSection({ plans = [], loading = false }) {
  const { user } = useAuth();

  // กรณียังโหลดข้อมูลอยู่
  if (loading) {
    return (
      <div className="mt-12 mx-auto max-w-[1320px] m-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">แผนเที่ยว</h2>
          {user && (
            <Link to="/create-plan">
              <button className="flex items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                <span className="mr-2">+</span>
                <span>เพิ่มแผนเที่ยว</span>
              </button>
            </Link>
          )}
        </div>
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // สร้าง mock แผนท่องเที่ยวไว้ก่อน ถ้า API ยังไม่พร้อม
  const mockPlans = [
    {
      id: 1,
      title: "ONE DAY TRIP เจริญกรุง - บางรัก",
      category: "กรุงเทพ - บางรัก",
      coverImage: "https://placehold.co/600x400?text=Bangkok",
    },
    {
      id: 2,
      title: "ไหว้พระ 9 วัด รับปีใหม่",
      category: "กรุงเทพ",
      coverImage: "https://placehold.co/600x400?text=Temple",
    },
    {
      id: 3,
      title: "DIY ใกล้ลุง",
      category: "พัทลุง",
      coverImage: "https://placehold.co/600x400?text=Boat",
    },
  ];

  // ถ้าไม่มีแผนจาก API ให้ใช้แผนตัวอย่าง
  const displayPlans = plans.length > 0 ? plans : mockPlans;

  return (
    <div className="mt-12 mx-auto max-w-[1320px] m-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">แผนเที่ยว</h2>
        {user && (
          <Link to="/create-plan">
            <button className="flex items-center bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
              <span className="mr-2">+</span>
              <span>เพิ่มแผนเที่ยว</span>
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPlans.map((plan) => (
          <Link to={`/my-travel-plan/${plan.id}`} key={plan.id}>
            <Card
              image={plan.coverImage}
              title={plan.title || plan.name}
              description={plan.category || ""}
              onImageError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TravelPlanSection;