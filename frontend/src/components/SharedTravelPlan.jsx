import React, { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"
import TravelCard from "./TravelCard"
import { Link } from 'react-router-dom'
import Pagination from "./Pagination"
import { MOCK_PLANS, MOCK_ATTRACTIONS } from '../mockData/mockData'

function SharedTravelPlan() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedSort, setSelectedSort] = useState("ล่าสุด")

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption)
    setShowDropdown(false)
    // สามารถเพิ่ม logic การ sort ได้ที่นี่
  }

  // แปลงข้อมูล MOCK_PLANS ให้เหมาะกับ TravelCard และโชว์ชื่อสถานที่จริง
  const plans = MOCK_PLANS.map(plan => {
    let locations = [];
    try {
      const arr = JSON.parse(plan.jsonData)
      const placesBlock = arr.find(b => b.type === 'places')
      if (placesBlock && Array.isArray(placesBlock.data.places)) {
        locations = placesBlock.data.places.map(placeId => {
          const found = MOCK_ATTRACTIONS.find(a => a.id === placeId)
          return found ? found.name : `สถานที่ ${placeId}`
        })
      }
    } catch {}
    return {
      id: plan.id,
      image: plan.coverImage,
      title: plan.title,
      author: plan.author || 'ผู้ใช้',
      locations,
      likes: plan.likes || Math.floor(Math.random() * 200)
    }
  })

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Link to={`/travel-plan/${plan.id}`} key={plan.id}>
              <TravelCard {...plan} />
            </Link>
          ))}
        </div>
        <Pagination />
        </div>
      </div>
    </div>
  )
}

export default SharedTravelPlan