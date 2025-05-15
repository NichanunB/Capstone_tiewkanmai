import React from 'react';
import PlaceHeader from './PlaceHeader';

const PlaceDetail = ({
  title,
  address,
  rating,
  tags,
  description,
  imageUrl
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
        <img src={imageUrl} alt={title} className="w-full h-80 object-cover" />
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      <div className="border-t border-gray-200 my-6"></div>
      <h2 className="text-2xl font-bold mb-4">แผนที่</h2>
      <div className="h-80 bg-gray-200 rounded overflow-hidden">
        <img 
          src="/lovable-uploads/943f41cd-99dd-48e4-b008-79084143e614.png" 
          alt="Map" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>
    </div>
  );
};

export default PlaceDetail;
