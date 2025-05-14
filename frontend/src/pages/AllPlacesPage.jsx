import React from "react";
import PlaceList from "../components/PlaceList";

const AllPlacesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">สถานที่ทั้งหมด</h1>
      <PlaceList />
    </div>
  );
};

export default AllPlacesPage;
