import React, { useEffect, useState } from 'react';
import PlaceCard from './PlaceCard';

const PlaceList = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch('/api/places');
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};

export default PlaceList;
