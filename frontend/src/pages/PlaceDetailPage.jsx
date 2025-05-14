import React from "react";
import { useParams } from "react-router-dom";
import PlaceDetail from "../components/PlaceDetail";

const PlaceDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดสถานที่</h1>
      <PlaceDetail placeId={id} />
    </div>
  );
};

export default PlaceDetailPage;
