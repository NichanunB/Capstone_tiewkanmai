// src/components/LongdoMapComponent.jsx
import React, { useEffect, useRef, useState } from 'react';

const LongdoMapComponent = ({ latitude, longitude, markers = [], height = '400px' }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  
  // ใช้ API Key ที่คุณให้มา
  const LONGDO_API_KEY = 'cfc5d0e7f5395c340c922097a1853059';

  useEffect(() => {
    let map = mapRef.current;

    // เพิ่ม event listener เพื่อรอ Longdo Map API โหลด
    const onLongdoLoad = () => {
      console.log("Longdo Map API loaded.");
      initializeMap();
    };

    // ฟังก์ชัน initialize/update แผนที่
    const initializeMap = () => {
      // ตรวจสอบว่า Longdo Map API โหลดแล้ว และมีค่าพิกัด
      if (!mapContainerRef.current) {
        setError("ไม่พบ container สำหรับแผนที่");
        return;
      }

      if (!window.longdo) {
        setError("Longdo Map API ยังไม่พร้อมใช้งาน");
        return;
      }

      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        setError("ไม่พบข้อมูลพิกัดที่ถูกต้อง");
        return;
      }

      try {
        // ถ้ายังไม่มีการสร้างแผนที่
        if (!map) {
          console.log("Initializing Longdo Map...");
          map = new window.longdo.Map({
            placeholder: mapContainerRef.current,
            language: 'th',
            zoom: 15,
            location: { lon: longitude, lat: latitude },
            key: LONGDO_API_KEY
          });
          
          // เก็บ reference ของแผนที่
          mapRef.current = map;
          console.log("Longdo Map initialized.");
          setError(null);
        } else {
          // ถ้ามีแผนที่อยู่แล้ว เปลี่ยนตำแหน่ง
          console.log(`Updating map location to lat: ${latitude}, lon: ${longitude}`);
          map.location({ lon: longitude, lat: latitude });
        }
        
        // ล้าง markers เดิมและเพิ่ม markers ใหม่
        if (map) {
          map.Overlays.clear();
          
          // ถ้ามี markers จากภายนอก ให้เพิ่มทั้งหมด
          if (markers && markers.length > 0) {
            markers.forEach(markerData => {
              if (markerData && typeof markerData.latitude === 'number' && typeof markerData.longitude === 'number') {
                console.log(`Adding marker at lat: ${markerData.latitude}, lon: ${markerData.longitude}`);
                const marker = new window.longdo.Marker({ 
                  lon: markerData.longitude, 
                  lat: markerData.latitude 
                }, {
                  title: markerData.title || '',
                  detail: markerData.detail || ''
                });
                map.Overlays.add(marker);
              }
            });
          } else {
            console.log(`Adding current location marker at lat: ${latitude}, lon: ${longitude}`);
            const marker = new window.longdo.Marker({ lon: longitude, lat: latitude });
            map.Overlays.add(marker);
          }
        }
      } catch (error) {
        console.error("Error initializing or updating Longdo Map:", error);
        setError("เกิดข้อผิดพลาดในการแสดงแผนที่: " + error.message);
      }
    };

    // ถ้า Longdo Map API โหลดแล้ว ก็ initialize เลย
    if (window.longdo) {
      onLongdoLoad();
    } else {
      // รอให้ API โหลดเสร็จ
      window.addEventListener('load', onLongdoLoad);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('load', onLongdoLoad);
      if (mapRef.current) {
        mapRef.current.Overlays.clear();
      }
    };
  }, [latitude, longitude, markers]);

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      {error ? (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div 
          ref={mapContainerRef} 
          style={{ width: '100%', height, borderRadius: '0.5rem' }}
        ></div>
      )}
    </div>
  );
};

export default LongdoMapComponent;