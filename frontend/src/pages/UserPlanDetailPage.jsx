import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import components สำหรับแสดง block ต่างๆ ในแผน (ถ้ามี)
// import TitleBlock from '../components/create-plan/TitleBlock';
// import CoverImageBlock from '../components/create-plan/CoverImageBlock';
// import BlockRenderer from '../components/create-plan/BlockRenderer'; // สมมติว่ามี component นี้ไว้วาด block
import { MOCK_PLANS, MOCK_ATTRACTIONS } from '../mockData/mockData'; // ✅ import MOCK_PLANS และ MOCK_ATTRACTIONS

const UserPlanDetailPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      let foundPlan = null;

      // ลองดึงข้อมูลจาก MOCK_PLANS ก่อน (สำหรับแผนเที่ยวคนอื่น)
      // ต้อง import MOCK_PLANS เข้ามาในไฟล์นี้ด้วย
      foundPlan = MOCK_PLANS.find(p => String(p.id) === String(id));

      // ถ้าไม่เจอใน MOCK_PLANS ให้ลองดึงจาก localStorage (สำหรับแผนของผู้ใช้เอง)
      if (!foundPlan) {
        const userPlans = JSON.parse(localStorage.getItem('userPlans') || '[]');
        foundPlan = userPlans.find(p => String(p.id) === String(id));
      }
      
      setPlan(foundPlan || null);

    } catch (err) {
      console.error('ไม่สามารถโหลดข้อมูลแผน:', err);
      setError('ไม่สามารถโหลดข้อมูลแผนได้');
    } finally {
      setLoading(false);
    }
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
             {/* ตรวจสอบว่า plan.jsonData มีค่าและเป็น string ก่อน parse */}
             {plan.jsonData && typeof plan.jsonData === 'string' && JSON.parse(plan.jsonData).map((dayBlock, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                    <h3 className="text-xl font-semibold mb-3">วันที่ {dayBlock.day}</h3>
                     {/* ตรวจสอบว่า dayBlock.places เป็น array และมีข้อมูลก่อน map */}
                     {Array.isArray(dayBlock.places) && dayBlock.places.length > 0 ? (
                        <ul className="list-disc list-inside ml-4">
                            {dayBlock.places.map((placeItem, placeIndex) => {
                                 // ค้นหาชื่อสถานที่จาก MOCK_ATTRACTIONS โดยใช้ placeItem.id
                                 const attraction = MOCK_ATTRACTIONS.find(attr => attr.id === placeItem.id);
                                 const placeName = attraction ? (attraction.name || attraction.title) : (placeItem.name || 'ไม่พบชื่อสถานที่');

                                return (
                                    <li key={placeIndex} className="mb-2 text-gray-700">
                                        {/* สามารถเพิ่ม icon หน้าชื่อสถานที่ได้ */}
                                        {/* <svg className="inline-block h-4 w-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a4.998 4.998 0 010-7.07m.002 7.07l7.07-7.07A4.998 4.998 0 0017.656 9.58a4.998 4.998 0 00-7.07-7.07L6.344 9.58a4.997 4.997 0 000 7.07zM15.707 10.293a1 1 0 11-1.414-1.414L15.707 10.293z"></path></svg> */}
                                        {placeName}
                                         {/* สามารถเพิ่มเวลาเข้าชมหรือข้อมูลย่อๆ ได้ถ้ามีใน placeItem หรือ jsonData */}
                                         {/* {placeItem.visitDuration && <span className="text-gray-500 text-sm ml-2">({placeItem.visitDuration} ชม.)</span>} */}
                                    </li>
                                );
                            })} 
                        </ul>
                     ) : (
                        <p className="text-gray-600 text-sm">ไม่มีสถานที่ในวันนี้</p>
                     )}
                </div>
             ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default UserPlanDetailPage; 