import React, { useState, useEffect } from "react"
import { Globe, ChevronDown } from "lucide-react"
import TravelCard from "./TravelCard"
import { Link } from 'react-router-dom'
import Pagination from "./Pagination"
import { planService } from '../services/api'

const sortMap = {
  "ล่าสุด": "latest",
  "ยอดนิยม": "popular",
  "ถูกใจมากสุด": "popular"
};

function SharedTravelPlan() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedSort, setSelectedSort] = useState("ล่าสุด")
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const sortParam = sortMap[selectedSort] || undefined;
        const res = await planService.getAllPublicPlans(sortParam);
        setPlans(res.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedSort]);

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption)
    setShowDropdown(false)
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-8 w-8" />
                <h1 className="text-2xl font-bold">แผนเที่ยวคนอื่น</h1>
              </div>
              <p className="text-gray-600 text-sm">
                ดูแผนเที่ยวจากผู้ใช้งาน แล้วสร้างแรงบันดาลใจให้การเดินทางของคุณ!
              </p>
            </div>
            <div className="relative">
              <button
                className="bg-[#3674B5] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>{selectedSort}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-1 bg-[#E7F9FF] rounded-lg shadow-md w-40 z-10">
                  <div className="p-2 text-sm">
                    <div 
                      className="py-1 cursor-pointer hover:bg-[#3674B5]/10 px-2 rounded-lg"
                      onClick={() => handleSortSelect("ล่าสุด")}
                    >
                      ล่าสุด
                    </div>
                    <div 
                      className="py-1 cursor-pointer hover:bg-[#3674B5]/10 px-2 rounded-lg"
                      onClick={() => handleSortSelect("ยอดนิยม")}
                    >
                      ยอดนิยม
                    </div>
                    <div 
                      className="py-1 cursor-pointer hover:bg-[#3674B5]/10 px-2 rounded-lg"
                      onClick={() => handleSortSelect("ถูกใจมากสุด")}
                    >
                      ถูกใจมากสุด
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">ไม่พบแผนเที่ยว</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Link to={`/travel-plan/${plan.id}`} key={plan.id}>
                  <TravelCard 
                    image={plan.coverImage || plan.img}
                    title={plan.title || plan.name}
                    author={plan.user?.firstName || 'ผู้ใช้'}
                    locations={plan.locations || []}
                    likes={plan.favAmount || 0}
                  />
                </Link>
              ))}
            </div>
          )}
          <Pagination />
        </div>
      </div>
    </div>
  )
}

export default SharedTravelPlan
