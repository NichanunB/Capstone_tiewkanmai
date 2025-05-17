import React from 'react';
import { Link } from 'react-router-dom';

const PlanListItem = ({ plan, onDelete, linkPath }) => {
  // ตรวจสอบให้แน่ใจว่า plan object มีข้อมูลพื้นฐานที่จำเป็น
  const planId = plan?.id;
  const planTitle = plan?.title || plan?.name || 'ไม่มีชื่อแผน';
  const planNote = plan?.note || 'ไม่มีโน้ต';
  const planCreatedAt = plan?.createdAt ? new Date(plan.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่';

  // กำหนด path สำหรับลิงก์ ถ้าไม่ได้ระบุ linkPath มา ให้ใช้ default สำหรับผู้ใช้
  const finalLinkPath = linkPath ? linkPath.replace(':id', planId) : `/my-travel-plan/${planId}`;

  if (!planId) {
      console.error("PlanListItem: Plan object is missing ID", plan);
      return null; // ไม่แสดงผลถ้าไม่มี ID
  }

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h4 className="text-lg font-semibold">{planTitle}</h4>
        <p className="text-sm text-gray-500">{planNote}</p>
        <p className="text-xs text-gray-400 mt-1">
          สร้างเมื่อ: {planCreatedAt}
        </p>
      </div>
      <div className="flex gap-2">
        {/* ลิงก์ไปยังหน้ารายละเอียดแผน */}
        <Link to={finalLinkPath}>
          <button className="text-blue-500 hover:underline">ดู</button>
        </Link>
        {/* ปุ่มลบ จะแสดงเฉพาะเมื่อมี prop onDelete ถูกส่งมา (เช่น ในหน้า Dashboard ของฉัน) */}
        {onDelete && typeof onDelete === 'function' && (
          <button
            onClick={() => onDelete(planId)}
            className="text-red-500 hover:underline ml-4"
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanListItem; 