import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PlaceDetail = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await fetch(`/api/places/${id}`);
        const data = await res.json();
        setPlace(data);
      } catch (err) {
        console.error('Failed to fetch place:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!place) return <div className="p-4">ไม่พบข้อมูลสถานที่</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
      <img src={place.imageUrl || 'https://via.placeholder.com/600x400'} alt={place.name} className="rounded-lg mb-4" />
      <p className="text-gray-700">{place.description}</p>
      <p className="mt-2 text-sm text-gray-500">หมวดหมู่: {place.category || 'ไม่ระบุ'}</p>
    </div>
  );
};

export default PlaceDetail;
