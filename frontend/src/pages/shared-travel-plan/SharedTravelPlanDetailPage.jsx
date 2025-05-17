import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PLANS } from '../../mockData/mock_plans';
import { MOCK_ATTRACTIONS } from '../../mockData/mockData';
import { MapPin, DollarSign, FileText } from 'lucide-react';

const SharedTravelPlanDetailPage = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planContent, setPlanContent] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(null);

  useEffect(() => {
    setLoading(true);
    const foundPlan = MOCK_PLANS.find(p => p.id === parseInt(id));
    
    if (foundPlan) {
      setPlan(foundPlan);
      
      try {
        const jsonData = JSON.parse(foundPlan.jsonData);
        
        const extractedContent = [];
        let cost = null;

        if (Array.isArray(jsonData)) {
          jsonData.forEach(item => {
            if (item.type === 'notes' && item.data && item.data.text) {
              extractedContent.push({
                type: 'note',
                text: item.data.text,
              });
            } else if (item.type === 'places' && item.data && Array.isArray(item.data.places)) {
              const placeNames = item.data.places.map(placeId => {
                const attraction = MOCK_ATTRACTIONS.find(attr => attr.id === placeId);
                return attraction ? attraction.name_th : `Unknown Place (ID: ${placeId})`;
              });
              if (placeNames.length > 0) {
                 extractedContent.push({
                  type: 'places',
                  placeNames: placeNames,
                });
              }
            } else if (item.type === 'budget' && item.data && Array.isArray(item.data.items)) {
              const totalCost = item.data.items.reduce((sum, budgetItem) => sum + (budgetItem.amount || 0), 0);
              cost = totalCost;
            }
          });
        }

        setPlanContent(extractedContent);
        setEstimatedCost(cost);

      } catch (error) {
        console.error("Error parsing plan jsonData:", error);
        setPlanContent([{ type: 'error', text: 'ไม่สามารถโหลดรายละเอียดแผนได้' }]);
        setEstimatedCost(null);
      }

    } else {
      setPlan(null);
      setPlanContent([{ type: 'error', text: 'ไม่พบแผนท่องเที่ยวนี้' }]);
      setEstimatedCost(null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">กำลังโหลด...</div>;
  }

  if (!plan) {
    return <div className="text-center py-8">ไม่พบแผนท่องเที่ยวนี้</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg overflow-hidden shadow-md mb-8">
        {plan.coverImage && (
           <img 
            src={plan.coverImage}
            alt={plan.title || 'แผนเที่ยว'}
            className="w-full h-80 object-cover"
          />
        )}
        
        <div className="p-6 bg-white">
          <h1 className="text-3xl font-bold mb-2">{plan.title || 'ไม่มีชื่อแผน'}</h1>
          <p className="text-gray-600 text-sm mb-4">โดย {plan.author || 'ไม่ระบุผู้สร้าง'} - สร้างเมื่อ: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'ไม่ทราบวันที่'}</p>
          
          {plan.note && (
             <div className="mb-4 text-gray-700">
                <strong className="font-semibold">บันทึก:</strong> {plan.note}
             </div>
          )}

          {planContent.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">รายละเอียดแผน</h2>
              {planContent.map((item, index) => (
                <div key={index} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
                  {item.type === 'note' && item.text && (
                    <div className="flex items-start gap-2 text-gray-700">
                       <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                       <span>{item.text}</span>
                    </div>
                  )}
                  {item.type === 'places' && item.placeNames && item.placeNames.length > 0 && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>สถานที่: {item.placeNames.join(', ')}</span>
                    </div>
                  )}
                  {item.type === 'error' && item.text && (
                     <div className="text-red-500">{item.text}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {estimatedCost !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span>ค่าใช้จ่ายโดยประมาณ: {estimatedCost.toLocaleString()} บาท</span>
            </div>
          )}
          
           {/* Fallback if no content is extracted but plan is found */}
           {plan && planContent.length === 0 && estimatedCost === null && ( !plan.note ) && (
              <div className="text-gray-500">ไม่พบรายละเอียดสำหรับแผนนี้ในขณะนี้</div>
           )}

        </div>
      </div>

      {/* You can add more sections here, e.g., map view */}

    </div>
  );
};

export default SharedTravelPlanDetailPage; 