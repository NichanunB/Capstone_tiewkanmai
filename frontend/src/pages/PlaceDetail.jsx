// src/pages/PlaceDetail.jsx
import React, { useEffect, useRef } from 'react';
import PlaceHeader from './PlaceHeader';

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
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (latitude && longitude && mapContainerRef.current && window.longdo) {
      const map = new window.longdo.Map({
        placeholder: mapContainerRef.current,
        language: 'th',
        zoom: 15,
        location: { lon: longitude, lat: latitude }
      });

      const marker = new window.longdo.Marker({ lon: longitude, lat: latitude });
      map.Overlays.add(marker);
      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]);

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
          <div 
            ref={mapContainerRef} 
            style={{ width: '100%', height: '100%' }}
          ></div>
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
