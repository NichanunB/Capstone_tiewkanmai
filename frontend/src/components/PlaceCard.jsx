import React from "react";

const PlaceCard = ({ place }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold">{place?.name || "ชื่อสถานที่"}</h2>
      <p>{place?.description || "คำอธิบายสถานที่"}</p>
    </div>
  );
};

export default PlaceCard;
