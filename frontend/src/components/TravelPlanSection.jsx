import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

function TravelPlanSection() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get("/api/plans/public") // <-- ปรับ endpoint ให้ตรงกับ backend
      .then(res => setPlans(res.data))
      .catch(err => console.error("โหลดแผนเที่ยวล้มเหลว:", err));
  }, []);

  return (
    <div className="mt-12 mx-auto max-w-[1320px] m-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">แผนเที่ยว</h2>
        <button className="flex items-center bg-gray-100 px-4 py-2 rounded-md">
          <span className="mr-2">+</span>
          <span>เพิ่มแผนเที่ยว</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            image="/placeholder.jpg" // ✅ เปลี่ยนเป็น plan.image ถ้ามี field รูปภาพ
            title={plan.title}
            category={plan.description || ""}
          />
        ))}
      </div>
    </div>
  );
}

export default TravelPlanSection;
