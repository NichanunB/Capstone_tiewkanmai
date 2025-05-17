// src/pages/PlaceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlaceDetail from '../components/PlaceDetail';
import RecommendedPlaces from '../components/RecommendedPlaces';
import { MOCK_ATTRACTIONS } from '../mockData/mockData';

const PlaceDetailPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [place, setPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // ดึงข้อมูลจาก MOCK_ATTRACTIONS
    const found = MOCK_ATTRACTIONS.find(p => String(p.id) === String(id));
    setPlace(found || null);
    // หา related (จังหวัดเดียวกัน)
    if (found) {
      const related = MOCK_ATTRACTIONS.filter(p => p.id !== found.id && p.province === found.province).slice(0, 3);
      setRelatedPlaces(related);
    } else {
      setRelatedPlaces([]);
    }
    setLoading(false);
  }, [id]);

  // แปลงข้อมูลสำหรับ RecommendedPlaces
  const formatRelatedPlaces = (places) => {
    return places.map(place => ({
      id: place.id,
      title: place.name,
      imageUrl: place.image || place.coverImage,
      location: place.province,
      rating: place.rating || 0,
      tags: place.category ? [place.category] : []
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
          tags={place.categories || [place.category].filter(Boolean)}
          description={place.description || 'ไม่มีข้อมูลรายละเอียด'}
          imageUrl={place.image || place.coverImage}
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