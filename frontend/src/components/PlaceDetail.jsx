import React from 'react';
import PlaceHeader from './PlaceHeader';
import LongdoMapComponent from './LongdoMapComponent';

const PlaceDetail = ({
  title,
  address,
  rating,
  tags,
  description,
  imageUrl,
  latitude,
  longitude
}) => {
  // Log ค่า latitude และ longitude ที่ได้รับมาเพื่อตรวจสอบ
  console.log("PlaceDetail received latitude:", latitude);
  console.log("PlaceDetail received longitude:", longitude);

  // ใช้ placehold.co เป็น fallback
  const fallbackImageUrl = imageUrl || `https://placehold.co/800x400?text=${title || 'No Image Available'}`;

  return (
    <div className="mb-6">
      <PlaceHeader
        title={title}
        address={address}
        rating={rating}
        tags={tags}
      />
      <div className="rounded overflow-hidden mb-4">
        <img 
          src={fallbackImageUrl}
          alt={title}
          className="w-full h-80 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/800x400?text=Image+Not+Found`;
          }}
        />
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      <div className="border-t border-gray-200 my-6"></div>
      <h2 className="text-2xl font-bold mb-4">แผนที่</h2>
      <div className="h-80 bg-gray-200 rounded overflow-hidden">
        {/* ตรวจสอบว่า latitude และ longitude เป็นตัวเลขก่อนส่งให้ LongdoMapComponent */}
        {typeof latitude === 'number' && typeof longitude === 'number' ? (
          <LongdoMapComponent 
            latitude={latitude} 
            longitude={longitude} 
            height="320px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            ไม่มีข้อมูลแผนที่ที่ถูกต้อง
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;