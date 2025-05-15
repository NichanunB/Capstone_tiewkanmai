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
          src={imageUrl || 'https://via.placeholder.com/800x400?text=No+Image+Available'} 
          alt={title} 
          className="w-full h-80 object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
          }}
        />
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      <div className="border-t border-gray-200 my-6"></div>
      <h2 className="text-2xl font-bold mb-4">แผนที่</h2>
      <div className="h-80 bg-gray-200 rounded overflow-hidden">
        {latitude && longitude ? (
          <LongdoMapComponent 
            latitude={latitude} 
            longitude={longitude} 
            height="320px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            ไม่มีข้อมูลแผนที่
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;