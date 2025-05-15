import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { placeService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlaceDetail from './PlaceDetail';

const PlaceDetailPage = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      placeService
        .getPlaceById(id)
        .then((res) => {
          setPlace(res.data);
        })
        .catch((err) => {
          console.error('ไม่สามารถโหลดข้อมูลสถานที่:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        ไม่พบข้อมูลสถานที่
      </div>
    );
  }

  return (
    <div className="bg-[#E7F9FF] min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <PlaceDetail
          title={place.place_name}
          address={place.address}
          rating={place.rating}
          tags={[place.category_name, place.sub_category]} // แปลงเป็น array
          description={place.description}
          imageUrl={place.img}
          latitude={place.latitude}
          longitude={place.longitude}
        />
      </div>
      <Footer />
    </div>
  );
};

export default PlaceDetailPage;
