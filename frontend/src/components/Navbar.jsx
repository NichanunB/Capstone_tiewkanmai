import React, { useState, useRef } from 'react'
import logo from '../assets/logo.png'
import Button from './ui/Button'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, ChevronDown } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  return (
    <nav className='bg-white'>
        <div className='container mx-auto max-w-[1320px] relative h-auto p-10 flex flex-col md:flex-row md:justify-between md:items-center md:h-[80px]'>
            <div className='flex items-center gap-8'>
                <Link to="/">
                    <img className='w-[150px] h-auto' src={logo} alt="" />
                </Link>
                <ul className='hidden md:flex'>
                    <li className='mx-4'><Link to="/" className='hover:text-[#3674B5] transition-colors duration-200 cursor-pointer'>หน้าแรก</Link></li>
                    <li className='mx-4'><Link to="/search" className='hover:text-[#3674B5] transition-colors duration-200 cursor-pointer'>แหล่งท่องเที่ยว</Link></li>
                    <li className='mx-4'><Link to="/featured" className='hover:text-[#3674B5] transition-colors duration-200 cursor-pointer'>แผนเที่ยวคนอื่น</Link></li>
                </ul>
            </div>

            {user ? (
              <div className='flex items-center gap-4'>
                <form onSubmit={handleSearch} className='relative'>
                  <input
                    type="text"
                    placeholder="ค้นหาสถานที่ท่องเที่ยว..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3674B5]'
                  />
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                </form>
                <div className='relative'>
                  <div 
                    className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer'
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className='w-8 h-8 rounded-full' />
                    ) : (
                      <div className='w-8 h-8 rounded-full bg-[#E7F9FF] flex items-center justify-center'>
                        <User className='w-5 h-5 text-gray-500' />
                      </div>
                    )}
                    <span className='hidden md:block'>{user.name}</span>
                    <ChevronDown className='w-4 h-4' />
                  </div>
                  
                  {isDropdownOpen && (
                    <div 
                      className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50'
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link 
                        to="/dashboard" 
                        className='block px-4 py-2 hover:bg-gray-100'
                      >
                        บัญชีของฉัน
                      </Link>
                      <button 
                        onClick={logout}
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer'
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ul className='flex flex-row gap-3 ml-auto'>
                <Link to="/signin" className='cursor-pointer inline-block'>
                    <Button variant="outline">เข้าสู่ระบบ</Button>
                </Link>
                <Link to="/signup" className='cursor-pointer inline-block'>
                    <Button>สมัครสมาชิก</Button>
                </Link>  
              </ul>
            )}
        </div>
    </nav>
  )
}

export default Navbar