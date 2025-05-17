import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import components สำหรับแสดง block ต่างๆ ในแผน (ถ้ามี)
// import TitleBlock from '../components/create-plan/TitleBlock';
// import CoverImageBlock from '../components/create-plan/CoverImageBlock';
// import BlockRenderer from '../components/create-plan/BlockRenderer'; // สมมติว่ามี component นี้ไว้วาด block
import { planService } from '../services/api'; // ✅ import planService

const UserPlanDetailPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchPlan = async () => {
       try {
           // ✅ เรียก API เพื่อดึงข้อมูลแผนของผู้ใช้ตาม ID
           const response = await planService.getUserPlanById(id); 
         
           // ตรวจสอบว่า response มีข้อมูลและเป็น object
           if (response && response.data) {
              let planData = response.data;
              // ตรวจสอบและแปลง jsonData ถ้าเป็น string
              if (typeof planData.jsonData === 'string') {
                 try {
                    planData.jsonData = JSON.parse(planData.jsonData);
                    console.log("Parsed jsonData:", planData.jsonData); // Log parsed data
                 } catch (parseError) {
                    console.error('Error parsing jsonData:', parseError);
                    // จัดการ error หรือตั้งค่า jsonData เป็น null หรือ object ว่างตามเหมาะสม
                    planData.jsonData = null; // ตั้งค่าเป็น null หาก parse ไม่ได้
                    setError("ไม่สามารถแสดงรายละเอียดแผนท่องเที่ยวได้: รูปแบบข้อมูลภายในไม่ถูกต้อง");
                 }
              }
              // ตรวจสอบโครงสร้างข้อมูลหลักก่อนตั้งค่า state
              if (planData.title || planData.name || (planData.jsonData && Array.isArray(planData.jsonData))) {
                 setPlan(planData);
                 console.log("Set plan data:", planData); // เพิ่มบรรทัดนี้เพื่อ log ข้อมูล
              } else {
                 console.warn("API returned data but structure is unexpected:", planData);
                 setPlan(null);
                 setError("ไม่พบข้อมูลแผนท่องเที่ยวหรือข้อมูลไม่สมบูรณ์");
              }

           } else {
             // กรณี API ไม่ได้ return ค่าที่คาดหวัง
             console.warn("API did not return expected data for plan detail:", response);
             setPlan(null); // ตั้งค่าเป็น null หรือจัดการ error ตามเหมาะสม
             setError("ไม่สามารถโหลดข้อมูลแผนท่องเที่ยวของคุณได้: ไม่พบข้อมูลหรือรูปแบบไม่ถูกต้องจากเซิร์ฟเวอร์");
           }
         
       } catch (err) {
           console.error('ไม่สามารถโหลดข้อมูลแผน:', err);
           // ตรวจสอบ status code ของ error ถ้าเป็น 404 (Not Found) แสดงว่าไม่พบแผน
           if (err.response && err.response.status === 404) {
              setError("ไม่พบแผนท่องเที่ยวที่คุณกำลังค้นหา");
           } else {
              setError('ไม่สามารถโหลดข้อมูลแผนได้ กรุณาลองใหม่ภายหลัง');
           }
           setPlan(null);
       } finally {
           setLoading(false);
       }
    };
    
    fetchPlan();

  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#E7F9FF] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center h-64">
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="bg-[#E7F9FF] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center h-64">
          <p className="text-red-500">{error || 'ไม่พบข้อมูลแผนการเดินทาง'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // แสดงรายละเอียดแผน
  return (
    <div className="bg-[#E7F9FF] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        {/* ส่วนหัวของแผน: ชื่อ, ผู้สร้าง, วันที่ */}
        <div className="mb-6">
           {/* ตรวจสอบและใช้ plan.title หรือ plan.name */} 
          <h1 className="text-3xl font-bold mb-2">{plan.title || plan.name || 'ไม่มีชื่อแผน'}</h1>
          <div className="text-gray-600 text-sm flex items-center mb-4">
             {/* สามารถเพิ่ม icon ผู้ใช้ได้ */} 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
             {/* สมมติว่ามี creator หรือ user ใน plan object */} 
            <span>โดย {plan.creator || plan.user?.name || 'ไม่ระบุ'}</span>
            {plan.createdAt && (
               <> 
                <span className="mx-2">•</span>
                <span>สร้างเมื่อ: {new Date(plan.createdAt).toLocaleDateString('th-TH')}</span>
               </>
            )}
          </div>
          {/* แสดงรูปปก (ถ้ามี) */}
          {plan.coverImage && (
            <img src={plan.coverImage} alt={plan.name} className="w-full h-64 object-cover rounded-md mb-6" />
          )}
           {/* แสดง Note ของแผน ถ้ามี */}
           {plan.note && (
              <div className="mb-6 p-4 bg-blue-50 rounded-md text-blue-800">
                 <p className="font-semibold mb-1">Note:</p>
                 <p className="text-sm">{plan.note}</p>
              </div>
           )}
        </div>

        {/* แสดง block ต่างๆ จาก jsonData */}
        <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">รายละเอียดแผน</h2>
             {/* ตรวจสอบว่า plan.jsonData มีค่าและเป็น array ก่อน map */}
             {plan.jsonData && Array.isArray(plan.jsonData) && plan.jsonData.length > 0 ? (
                plan.jsonData.map((block, index) => {
                // ตรวจสอบ type ของ block และแสดงผลตามนั้น
                // ปรับปรุง logic การแสดงผลให้รองรับโครงสร้างข้อมูลจากหน้าสร้างแผน
                if (block.type === 'note' && block.data?.text) { // สมมติว่าโน้ตถูกเก็บเป็น block type 'note'
                    return (
                        <div key={index} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">โน้ต</h3>
                            <p className="text-gray-700 text-sm">{block.data.text}</p>
                        </div>
                    );
                 } else if (block.type === 'location' && block.data?.name) { // สมมติว่าสถานที่ถูกเก็บเป็น block type 'location'
                     return (
                         <div key={index} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">สถานที่</h3>
                             <p className="text-gray-700 text-sm">{block.data.name}</p>
                         </div>
                     );
                 } else if (block.type === 'item' && block.data?.text) { // สมมติว่ารายการถูกเก็บเป็น block type 'item'
                     return (
                         <div key={index} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">รายการ</h3>
                             <p className="text-gray-700 text-sm">{block.data.text}</p>
                         </div>
                     );
                 } else if (block.type === 'budgetItem' && block.data?.item && block.data?.amount) { // สมมติว่างบประมาณถูกเก็บเป็น block type 'budgetItem'
                      return (
                         <div key={index} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <h3 className="text-xl font-semibold mb-2">รายการงบประมาณ</h3>
                             <p className="text-gray-700 text-sm">{block.data.item}: {block.data.amount} THB</p>
                         </div>
                      );
                 } else if (block.type === 'budgetSummary' && block.data?.totalBudget) { // รองรับ block budgetSummary เดิมด้วย
                    return (
                       <div key={index} className="mb-6 border-t pt-4">
                            <h3 className="text-xl font-semibold mb-3">สรุปงบประมาณ</h3>
                            <p className="text-lg font-bold text-green-700">รวม: {block.data.totalBudget} THB</p>
                            {block.data.foodBudget && <p className="text-gray-700">อาหาร: {block.data.foodBudget} THB</p>}
                            {block.data.travelBudget && <p className="text-gray-700">เดินทาง: {block.data.travelBudget} THB</p>}
                            {/* แสดงรายการงบประมาณย่อยอื่นๆ ได้ที่นี่ */}
                       </div>
                    );
                 } else if (block.type === 'day' && block.data?.day) { // รองรับ block day เดิมด้วย
                   return (
                      <div key={index} className="mb-6 border-b pb-4">
                           {/* แสดงหัวข้อวัน หรือข้อมูลอื่นๆ ที่ระดับวัน */}
                          <h3 className="text-xl font-semibold mb-3">วันที่ {block.data.day}</h3>
                            {/* แสดงสถานที่ในวันนี้ */}
                           {Array.isArray(block.data.places) && block.data.places.length > 0 ? (
                                <ul className="list-disc list-inside ml-4">
                                    {block.data.places.map((placeItem, placeIndex) => {
                                         // ดึงข้อมูลจาก placeItem
                                         const placeName = placeItem.name || 'ไม่พบชื่อสถานที่';
                                         const placeBudget = placeItem.budget; // สมมติมี field budget
                                         const placeNote = placeItem.note; // สมมติมี field note

                                        return (
                                            <li key={placeIndex} className="mb-2 text-gray-700">
                                                 {/* แสดงชื่อสถานที่ */}
                                                <strong className="text-gray-800">{placeName}</strong>
                                                 {/* แสดงงบประมาณต่อสถานที่ (ถ้ามี) */}
                                                {placeBudget && <span className="text-gray-600 text-sm ml-2">(งบประมาณ: {placeBudget} THB)</span>}
                                                 {/* แสดงโน้ตต่อสถานที่ (ถ้ามี) */}
                                                {placeNote && <p className="text-gray-600 text-sm mt-1 italic">โน้ต: {placeNote}</p>}
                                            </li>
                                        );
                                    })} 
                                </ul>
                            ) : (
                                <p className="text-gray-600 text-sm">ไม่มีสถานที่ในวันนี้</p>
                            )}
                         {/* แสดงข้อมูลอื่นๆ ที่ระดับวัน ถ้ามี เช่น โน้ตรวมของวันนี้ */}
                         {block.data.dayNote && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
                                <p className="font-semibold mb-1">โน้ตประจำวัน:</p>
                                <p>{block.data.dayNote}</p>
                            </div>
                         )}
                      </div>
                   );
                }
                 // สามารถเพิ่ม block type อื่นๆ ได้ที่นี่ หากโครงสร้าง jsonData แตกต่างไปจากที่คาดการณ์
                console.warn("Unknown block type or structure:", block); // Log block ที่ไม่รู้จัก
                return null; // ไม่แสดง block type ที่ไม่รู้จัก
             })) : (
                <p className="text-gray-600 text-sm">ไม่พบรายละเอียดเพิ่มเติมสำหรับแผนนี้</p>
             )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default UserPlanDetailPage; 