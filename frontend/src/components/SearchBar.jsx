import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    // Add your search functionality here
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
          className="px-4 py-3 bg-[#3674B5] text-white rounded-r-lg hover:bg-[#2a5b8e] focus:outline-none"
        >
          ไปเที่ยวกัน !
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <select className="px-4 py-3 bg-gray-200 rounded-lg border border-gray-300 w-full sm:w-48 focus:outline-none" defaultValue="">
          <option value="" disabled>จังหวัด</option>
          <option value="bangkok">กรุงเทพฯ</option>
          <option value="chiangmai">เชียงใหม่</option>
          <option value="phuket">ภูเก็ต</option>
        </select>

        <select className="px-4 py-3 bg-gray-200 rounded-lg border border-gray-300 w-full sm:w-48 focus:outline-none" defaultValue="">
          <option value="" disabled>อำเภอ</option>
          <option value="district1">อำเภอ 1</option>
          <option value="district2">อำเภอ 2</option>
          <option value="district3">อำเภอ 3</option>
        </select>

        <select className="px-4 py-3 bg-gray-200 rounded-lg border border-gray-300 w-full sm:w-48 focus:outline-none" defaultValue="">
          <option value="" disabled>ตำบล</option>
          <option value="subdistrict1">ตำบล 1</option>
          <option value="subdistrict2">ตำบล 2</option>
          <option value="subdistrict3">ตำบล 3</option>
        </select>
      </div>
    </div>
  );
}