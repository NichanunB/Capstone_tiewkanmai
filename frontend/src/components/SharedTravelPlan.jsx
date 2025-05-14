import React, { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"
import TravelCard from "./TravelCard"

const travelPlans = [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Backpacking Japan",
      author: "Alice",
      locations: ["Tokyo", "Kyoto", "Osaka"],
      likes: 95,
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title: "Europe on a Budget",
      author: "John",
      locations: ["Paris", "Berlin", "Rome"],
      likes: 88,
    },
    {
      id: 3,
      image: "/placeholder.svg",
      title: "Thailand Beach Escape",
      author: "Emma",
      locations: ["Phuket", "Krabi", "Koh Samui"],
      likes: 200,
    },
    {
      id: 4,
      image: "/placeholder.svg",
      title: "Road Trip Across USA",
      author: "Mike",
      locations: ["Los Angeles", "Las Vegas", "New York"],
      likes: 142,
    },
    {
      id: 5,
      image: "/placeholder.svg",
      title: "Discovering South Korea",
      author: "Soojin",
      locations: ["Seoul", "Busan", "Jeju"],
      likes: 130,
    },
    {
      id: 6,
      image: "/placeholder.svg",
      title: "Nordic Adventure",
      author: "Lena",
      locations: ["Oslo", "Stockholm", "Copenhagen"],
      likes: 110,
    },
    {
      id: 7,
      image: "/placeholder.svg",
      title: "Australia East Coast",
      author: "Liam",
      locations: ["Sydney", "Brisbane", "Cairns"],
      likes: 105,
    },
    {
      id: 8,
      image: "/placeholder.svg",
      title: "Magical Morocco",
      author: "Zara",
      locations: ["Marrakech", "Fez", "Chefchaouen"],
      likes: 89,
    },
    {
      id: 9,
      image: "/placeholder.svg",
      title: "Canadian Rockies",
      author: "Noah",
      locations: ["Banff", "Jasper", "Lake Louise"],
      likes: 150,
    },
  ]
  

function SharedTravelPlan() {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Shared Travel Plans</h1>
            </div>
            <p className="text-gray-600 text-sm">
              Explore travel plans created by other users and get inspired!
            </p>
          </div>
          <div className="relative">
            <button
              className="bg-[#3674B5] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>ล่าสุด</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 bg-[#E7F9FF] rounded-lg shadow-md w-40 z-10">
                <div className="p-2 text-sm">
                  <div className="py-1 cursor-pointer hover:bg-blue-200 px-2 rounded-lg">ล่าสุด</div>
                  <div className="py-1 cursor-pointer hover:bg-blue-200 px-2 rounded-lg">ยอดนิยม</div>
                  <div className="py-1 cursor-pointer hover:bg-blue-200 px-2 rounded-lg">ถูกใจมากสุด</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelPlans.map((plan) => (
            <TravelCard key={plan.id} {...plan} />
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default SharedTravelPlan
