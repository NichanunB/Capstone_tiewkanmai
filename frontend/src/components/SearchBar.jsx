// src/components/Searchbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { districtService, subdistrictService } from '../services/api';

export default function SearchBar({ provinces = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  
  const navigate = useNavigate();
  
  // โหลด district เมื่อเลือกจังหวัด
  useEffect(() => {
    if (selectedProvince) {
      districtService.getDistrictsByProvince(selectedProvince)
        .then(res => {
          setDistricts(res.data);
        })
        .catch(() => setDistricts([]));
      setSelectedDistrict('');
      setSubdistricts([]);
      setSelectedSubdistrict('');
    } else {
      setDistricts([]);
      setSelectedDistrict('');
      setSubdistricts([]);
      setSelectedSubdistrict('');
    }
  }, [selectedProvince]);

  // โหลด subdistrict เมื่อเลือก district
  useEffect(() => {
    if (selectedDistrict) {
      subdistrictService.getSubdistrictsByDistrict(selectedDistrict)
        .then(res => {
          setSubdistricts(res.data);
        })
        .catch(() => setSubdistricts([]));
    } else {
      setSubdistricts([]);
      setSelectedSubdistrict('');
    }
  }, [selectedDistrict]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // สร้าง query params
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedProvince) params.append('province', selectedProvince);
    if (selectedDistrict) params.append('district', selectedDistrict);
    if (selectedSubdistrict) params.append('subdistrict', selectedSubdistrict);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto my-6">
      {/* Search Box */}
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          placeholder="ลองค้นหา พัทลุง"
          className="flex-grow px-4 py-3 bg-gray-200 rounded-l-lg border border-gray-300 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="px-4 py-3 bg-[#3674B5] text-white rounded-r-lg hover:bg-[#2a5b8e] focus:outline-none cursor-pointer"
        >
          ไปเที่ยวกัน !
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <select 
          className="px-4 py-3 bg-gray-200 rounded-lg border border-gray-300 w-full sm:w-48 focus:outline-none cursor-pointer" 
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          <option value="">จังหวัด</option>
          {(Array.isArray(provinces) ? provinces : []).map(province => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>

        <select 
          className="px-4 py-3 bg-gray-200 rounded-lg border border-gray-300 w-full sm:w-48 focus:outline-none cursor-pointer"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedProvince}
        >
          <option value="">อำเภอ</option>
          {districts.map(district => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>

        <select 
          className="px-4 py-3 bg-gray-200 rounded-lg border border-gray-300 w-full sm:w-48 focus:outline-none cursor-pointer"
          value={selectedSubdistrict}
          onChange={(e) => setSelectedSubdistrict(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">ตำบล</option>
          {subdistricts.map(subdistrict => (
            <option key={subdistrict.id} value={subdistrict.id}>
              {subdistrict.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}