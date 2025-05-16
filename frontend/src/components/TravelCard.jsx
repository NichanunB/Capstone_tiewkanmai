import React from "react"
import { MapPin, Heart } from "lucide-react"

const TravelCard = ({ image, title, author, locations = [], likes = 0 }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title || "แผนเที่ยว"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{title || "ไม่มีชื่อ"}</h3>
        <p className="text-gray-600 text-sm mb-2">โดย {author || "ผู้ใช้"}</p>
        {locations && locations.length > 0 && (
          <div className="flex items-start gap-1 mb-4">
            <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm line-clamp-2">
              {locations.join(", ")}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center">
          <button className="text-sm font-medium text-[#3674B5] hover:text-[#2c5d91] transition-colors duration-200">
            ดูแผนเที่ยว
          </button>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelCard
