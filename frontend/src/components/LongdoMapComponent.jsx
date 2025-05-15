// src/components/LongdoMapComponent.jsx
import React, { useEffect, useRef } from 'react';

const LongdoMapComponent = ({ latitude, longitude, markers = [], height = '400px' }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // ถ้ามีค่าพิกัดและ Longdo Map API โหลดแล้ว
    if (latitude && longitude && mapContainerRef.current && window.longdo) {
      // ถ้ายังไม่มีการสร้างแผนที่
      if (!mapRef.current) {
        // สร้างแผนที่ใหม่
        const map = new window.longdo.Map({
          placeholder: mapContainerRef.current,
          language: 'th',
          zoom: 15,
          location: { lon: longitude, lat: latitude }
        });
        
        // เก็บ reference ของแผนที่
        mapRef.current = map;
      } else {
        // ถ้ามีแผนที่อยู่แล้ว เปลี่ยนตำแหน่ง
        mapRef.current.location({ lon: longitude, lat: latitude });
      }
      
      // ล้าง markers เดิมและเพิ่ม markers ใหม่
      if (mapRef.current) {
        mapRef.current.Overlays.clear();
        
        // ถ้ามี markers จากภายนอก ให้เพิ่มทั้งหมด
        if (markers && markers.length > 0) {
          markers.forEach(markerData => {
            const marker = new window.longdo.Marker({ 
              lon: markerData.longitude, 
              lat: markerData.latitude 
            }, {
              title: markerData.title || '',
              detail: markerData.detail || ''
            });
            mapRef.current.Overlays.add(marker);
          });
        } else {
          // ถ้าไม่มี markers จากภายนอก ให้เพิ่มเฉพาะตำแหน่งปัจจุบัน
          const marker = new window.longdo.Marker({ lon: longitude, lat: latitude });
          mapRef.current.Overlays.add(marker);
        }
      }
    }
    
    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, markers]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ width: '100%', height, borderRadius: '0.5rem' }}
    ></div>
  );
};

export default LongdoMapComponent;