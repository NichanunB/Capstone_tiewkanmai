import React, { useState, useMemo } from 'react';
import TravelCard from '../../components/TravelCard';
import { MOCK_PLANS } from '../../mockData/mock_plans';

const SharedTravelPlanPage = () => {
  const [displayType, setDisplayType] = useState('latest'); // 'latest', 'popular', 'liked'

  // Sort plans based on displayType
  const sortedPlans = useMemo(() => {
    let plans = [...MOCK_PLANS]; // Create a copy to avoid modifying original mock data
    if (displayType === 'latest') {
      plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (displayType === 'popular' || displayType === 'liked') {
      // Using likes for popular/liked as popularity data is not explicit
      plans.sort((a, b) => b.likes - a.likes);
    }
    return plans;
  }, [displayType]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">แผนเที่ยวคนอื่น</h1>
      
      {/* Filter/Sort Options */}
      <div className="flex justify-center mb-6 gap-4">
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium ${displayType === 'popular' ? 'bg-[#3674B5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setDisplayType('popular')}
        >
          ยอดนิยม
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium ${displayType === 'latest' ? 'bg-[#3674B5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setDisplayType('latest')}
        >
          ล่าสุด
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium ${displayType === 'liked' ? 'bg-[#3674B5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setDisplayType('liked')}
        >
          ยอดหัวใจ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => (
          <TravelCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default SharedTravelPlanPage; 