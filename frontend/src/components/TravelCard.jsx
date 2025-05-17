import React, { useState, useEffect } from "react"
import { MapPin, Heart } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const TravelCard = ({ plan }) => {
  const { id, image, title, author, locations = [], likes = 0 } = plan
  const navigate = useNavigate()
  const [isFavorited, setIsFavorited] = useState(false)

  // Check initial favorite status from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]')
    setIsFavorited(favorites.includes(id))
  }, [id])

  const handleCardClick = () => {
    navigate(`/shared-travel-plan/${id}`)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation() // Prevent card click when clicking heart
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]')
    let newFavorites
    if (isFavorited) {
      newFavorites = favorites.filter(favId => favId !== id)
    } else {
      newFavorites = [...favorites, id]
    }
    localStorage.setItem('favoritePlans', JSON.stringify(newFavorites))
    setIsFavorited(!isFavorited)
  }

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
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
          <span className="text-sm font-medium text-[#3674B5]">ดูแผนเที่ยว</span>
          <div className="flex items-center gap-1 cursor-pointer" onClick={handleFavoriteClick}>
            <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            <span className="text-sm">{likes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelCard
