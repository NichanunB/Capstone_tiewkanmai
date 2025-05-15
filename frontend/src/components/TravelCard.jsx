import React from "react"
import { MapPin, Heart } from "lucide-react"

const TravelCard = ({ image, title, author, locations, likes }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">By {author}</p>
        <div className="flex items-start gap-1 mb-4">
          <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 text-sm">{locations.join(", ")}</p>
        </div>
        <div className="flex justify-between items-center">
          <button className="text-sm font-medium">ดูแผนเที่ยว</button>
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
