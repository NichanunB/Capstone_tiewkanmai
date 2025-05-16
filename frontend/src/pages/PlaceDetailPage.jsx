// src/pages/PlaceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { placeService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlaceDetail from '../components/PlaceDetail';
import RecommendedPlaces from '../components/RecommendedPlaces';

const PlaceDetailPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [place, setPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // เรียกข้อมูลสถานที่ท่องเที่ยว
        const placeResponse = await placeService.getPlaceById(id);
        setPlace(placeResponse.data);
        
        // เรียกข้อมูลสถานที่ท่องเที่ยวที่เกี่ยวข้อง
        const relatedResponse = await placeService.getRelatedPlaces(id);
        setRelatedPlaces(relatedResponse.data);
      } catch (err) {
        console.error('ไม่สามารถโหลดข้อมูลสถานที่:', err);
        setError('ไม่สามารถโหลดข้อมูลสถานที่ได้');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlaceData();
    }
  }, [id]);

  // แปลงข้อมูลสำหรับ RecommendedPlaces
  const formatRelatedPlaces = (places) => {
    return places.map(place => ({
      id: place.id,
      title: place.name,
      imageUrl: place.image,
      location: place.province,
      rating: place.rating,
      tags: [place.category]
    }));
  };

  if (loading) {
    return (
      <div className="bg-[#E7F9FF] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="bg-[#E7F9FF] min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error || 'ไม่พบข้อมูลสถานที่'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#E7F9FF] min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <PlaceDetail
          title={place.name}
          address={place.address || ''}
          rating={place.rating || 0}
          tags={[place.category]}
          description={place.description || 'ไม่มีข้อมูลรายละเอียด'}
          imageUrl={place.image}
          latitude={place.latitude}
          longitude={place.longitude}
        />
        
        {relatedPlaces.length > 0 && (
          <RecommendedPlaces places={formatRelatedPlaces(relatedPlaces)} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PlaceDetailPage;