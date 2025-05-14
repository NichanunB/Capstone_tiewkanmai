import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";

const NearbyPlacesPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // TODO: ใช้ Geolocation API หรือ API backend ของคุณ
    // ตัวอย่างจำลองข้อมูล:
    setPlaces([
      { id: 1, name: "วัดใกล้บ้าน", description: "วัดสวยในละแวก" },
      { id: 2, name: "ร้านกาแฟ", description: "คาเฟ่ชิคๆ ใกล้ตัว" },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">สถานที่ใกล้ฉัน</h1>
      <PlaceList places={places} />
    </div>
  );
};

export default NearbyPlacesPage;
