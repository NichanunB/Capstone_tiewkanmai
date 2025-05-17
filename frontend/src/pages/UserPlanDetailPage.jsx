import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LongdoMapComponent from '../components/LongdoMapComponent';
import { planService } from '../services/api';

const UserPlanDetailPage = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedBlocks, setParsedBlocks] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchPlan = async () => {
      try {
        const response = await planService.getUserPlanById(id);
        console.log("Raw API response:", response);
         
        if (response && response.data) {
          let planData = response.data;
          console.log("Initial planData:", planData);
          
          // Parse jsonData if it's a string
          if (typeof planData.jsonData === 'string') {
            try {
              planData.jsonData = JSON.parse(planData.jsonData);
              console.log("Parsed jsonData:", planData.jsonData);
            } catch (parseError) {
              console.error('Error parsing jsonData:', parseError);
              planData.jsonData = null;
              setError("ไม่สามารถแสดงรายละเอียดแผนท่องเที่ยวได้: รูปแบบข้อมูลภายในไม่ถูกต้อง");
            }
          }
          
          setPlan(planData);
          
          // Process block data for display
          if (planData.jsonData) {
            // ถ้า jsonData เป็น object ที่มี properties
            if (typeof planData.jsonData === 'object' && !Array.isArray(planData.jsonData)) {
              const blocks = [];
              
              // เพิ่มโน้ตถ้ามี
              if (planData.jsonData.notes) {
                blocks.push({
                  type: 'notes',
                  data: { text: planData.jsonData.notes }
                });
              }
              
              // เพิ่มสถานที่ถ้ามี
              if (planData.jsonData.places && Array.isArray(planData.jsonData.places)) {
                blocks.push({
                  type: 'places',
                  data: { places: planData.jsonData.places }
                });
              }
              
              // เพิ่มรายการถ้ามี
              if (planData.jsonData.list && Array.isArray(planData.jsonData.list)) {
                blocks.push({
                  type: 'list',
                  data: { items: planData.jsonData.list }
                });
              }
              
              // เพิ่มงบประมาณถ้ามี
              if (planData.jsonData.budget && Array.isArray(planData.jsonData.budget)) {
                blocks.push({
                  type: 'budget',
                  data: { items: planData.jsonData.budget }
                });
              }
              
              setParsedBlocks(blocks);
            } 
            // ถ้า jsonData เป็น array
            else if (Array.isArray(planData.jsonData)) {
              setParsedBlocks(planData.jsonData);
            }
            else {
              console.warn("Unexpected jsonData structure:", planData.jsonData);
              setParsedBlocks([]);
            }
          } else {
            setParsedBlocks([]);
          }
        } else {
          console.warn("API did not return expected data for plan detail:", response);
          setPlan(null);
          setError("ไม่สามารถโหลดข้อมูลแผนท่องเที่ยวของคุณได้: ไม่พบข้อมูลหรือรูปแบบไม่ถูกต้องจากเซิร์ฟเวอร์");
        }
      } catch (err) {
        console.error('ไม่สามารถโหลดข้อมูลแผน:', err);
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

  const renderBlockContent = (block) => {
    console.log("Rendering block:", block);
    
    switch (block.type) {
      case 'notes':
        return (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">โน้ต</h3>
            <p className="text-gray-700">{block.data?.text || 'ไม่มีข้อความ'}</p>
          </div>
        );
      
      case 'places':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">สถานที่ท่องเที่ยว</h3>
            {block.data?.places && block.data.places.length > 0 ? (
              <div className="space-y-2">
                {block.data.places.map((place, idx) => (
                  <div key={place.id || idx} className="bg-white p-3 border rounded-lg">
                    <div className="font-medium mb-1">{place.name}</div>
                    {place.description && (
                      <p className="text-gray-600 text-sm">{place.description}</p>
                    )}
                    {place.address && (
                      <p className="text-gray-500 text-sm">{place.address}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">ไม่มีสถานที่ท่องเที่ยวในแผนนี้</p>
            )}
          </div>
        );
      
      case 'list':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">รายการ</h3>
            {block.data?.items && block.data.items.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {block.data.items.map((item, idx) => (
                  <li key={idx} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">ไม่มีรายการในบล็อกนี้</p>
            )}
          </div>
        );
      
      case 'budget':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">งบประมาณ</h3>
            {block.data?.items && block.data.items.length > 0 ? (
              <div className="bg-white p-4 rounded-lg border">
                <div className="space-y-2 mb-4">
                  {block.data.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.label || item.name || `รายการที่ ${idx + 1}`}</span>
                      <span className="font-medium">{item.amount.toLocaleString()} บาท</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>รวม</span>
                  <span className="text-green-600">
                    {block.data.items.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">ไม่มีข้อมูลงบประมาณ</p>
            )}
          </div>
        );
      
      default:
        console.warn("Unknown block type:", block.type);
        return null;
    }
  };

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

  return (
    <div className="bg-[#E7F9FF] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md my-8 max-w-4xl">
        {/* ส่วนหัวของแผน */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-[#3674B5]">{plan.title || plan.name || 'ไม่มีชื่อแผน'}</h1>
          <div className="text-gray-600 text-sm mb-4">
            <span>สร้างเมื่อ: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}</span>
          </div>
          
          {/* แสดงรูปปก */}
          {plan.coverImage && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={plan.coverImage} 
                alt={plan.title || "แผนท่องเที่ยว"} 
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          {/* แสดงโน้ตของแผน */}
          {plan.note && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800">{plan.note}</p>
            </div>
          )}
        </div>
        
        {/* แสดงรายละเอียดแต่ละบล็อก */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-6">รายละเอียดแผนท่องเที่ยว</h2>
          
          {parsedBlocks.length > 0 ? (
            parsedBlocks.map((block, index) => (
              <div key={block.id || index} className="mb-4">
                {renderBlockContent(block)}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">ไม่พบรายละเอียดเพิ่มเติมสำหรับแผนนี้</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserPlanDetailPage;