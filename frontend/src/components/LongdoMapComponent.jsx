// src/components/LongdoMapComponent.jsx
import React, { useEffect, useRef, useState } from 'react';

const LongdoMapComponent = ({ latitude, longitude, markers = [], height = '400px' }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  
  // ใช้ API Key ที่คุณให้มา
  const LONGDO_API_KEY = 'cfc5d0e7f5395c340c922097a1853059';

  useEffect(() => {
    // ฟังก์ชันโหลด Longdo Map API หากยังไม่ได้โหลด
    const loadLongdoMapAPI = () => {
      return new Promise((resolve, reject) => {
        if (window.longdo) {
          resolve(window.longdo);
          return;
        }

        // สร้าง script element เพื่อโหลด Longdo Map API
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://api.longdo.com/map/?key=${LONGDO_API_KEY}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log("Longdo Map API script loaded successfully");
          if (window.longdo) {
            resolve(window.longdo);
          } else {
            reject(new Error("Longdo Map API failed to initialize"));
          }
        };
        
        script.onerror = (error) => {
          console.error("Error loading Longdo Map API:", error);
          reject(new Error("Failed to load Longdo Map API"));
        };
        
        document.head.appendChild(script);
      });
    };

    // ฟังก์ชัน initialize/update แผนที่
    const initializeMap = async () => {
      try {
        // ตรวจสอบว่ามี container
        if (!mapContainerRef.current) {
          setError("ไม่พบ container สำหรับแผนที่");
          return;
        }

        // ตรวจสอบว่ามีค่าพิกัด
        if (latitude === undefined || longitude === undefined || 
            isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
          setError("ไม่พบข้อมูลพิกัดที่ถูกต้อง");
          return;
        }

        // แปลงค่าพิกัดให้เป็นตัวเลข
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        // โหลด Longdo Map API หากยังไม่ได้โหลด
        await loadLongdoMapAPI();

        if (!window.longdo) {
          setError("ไม่สามารถโหลด Longdo Map API ได้");
          return;
        }

        let map = mapRef.current;

        // ถ้ายังไม่มีการสร้างแผนที่
        if (!map) {
          console.log(`Initializing Longdo Map at lat: ${lat}, lon: ${lon}`);
          map = new window.longdo.Map({
            placeholder: mapContainerRef.current,
            language: 'th',
            zoom: 15,
            location: { lon, lat },
            key: LONGDO_API_KEY
          });
          
          // เก็บ reference ของแผนที่
          mapRef.current = map;
          console.log("Longdo Map initialized.");
          setError(null);
        } else {
          // ถ้ามีแผนที่อยู่แล้ว เปลี่ยนตำแหน่ง
          console.log(`Updating map location to lat: ${lat}, lon: ${lon}`);
          map.location({ lon, lat });
        }
        
        // ล้าง markers เดิมและเพิ่ม markers ใหม่
        if (map) {
          map.Overlays.clear();
          
          // ถ้ามี markers จากภายนอก ให้เพิ่มทั้งหมด
          if (markers && markers.length > 0) {
            markers.forEach(markerData => {
              if (markerData && !isNaN(parseFloat(markerData.latitude)) && 
                  !isNaN(parseFloat(markerData.longitude))) {
                const markerLat = parseFloat(markerData.latitude);
                const markerLon = parseFloat(markerData.longitude);
                console.log(`Adding marker at lat: ${markerLat}, lon: ${markerLon}`);
                const marker = new window.longdo.Marker({ 
                  lon: markerLon, 
                  lat: markerLat 
                }, {
                  title: markerData.title || '',
                  detail: markerData.detail || ''
                });
                map.Overlays.add(marker);
              }
            });
          } else {
            console.log(`Adding current location marker at lat: ${lat}, lon: ${lon}`);
            const marker = new window.longdo.Marker({ lon, lat });
            map.Overlays.add(marker);
          }
        }
      } catch (error) {
        console.error("Error initializing or updating Longdo Map:", error);
        setError("เกิดข้อผิดพลาดในการแสดงแผนที่: " + error.message);
      }
    };

    // เรียกฟังก์ชันเริ่มต้น
    initializeMap();

    // Cleanup function
    return () => {
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