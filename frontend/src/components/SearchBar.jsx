// src/components/Searchbar.jsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { provinceService } from '../services/api';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="flex w-full bg-white rounded-full shadow-md overflow-hidden pl-6 pr-2 py-2 items-center">
        <input
          type="text"
          placeholder="ค้นหาสถานที่ หรือ แผนเที่ยว..."
          className="flex-grow outline-none text-lg text-gray-700 placeholder-gray-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-[#3674B5] text-white p-3 rounded-full hover:bg-[#2A5A8E] transition-colors"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}