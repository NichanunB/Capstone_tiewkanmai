// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import Button from './ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, ChevronDown } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    // ถ้าอยู่ในหน้าที่จำเป็นต้องล็อกอิน ให้กลับไปหน้าแรก
    if (window.location.pathname.includes('/dashboard') || 
        window.location.pathname.includes('/create-plan')) {
      navigate('/');
    }
  };

  // ปิด dropdown เมื่อคลิกภายนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='container mx-auto max-w-[1320px] relative py-4 px-6 flex justify-between items-center'>
        <div className='flex items-center gap-8'>
          <Link to="/">
            <img className='w-[150px] h-auto' src={logo} alt="TiewKanMai Logo" />
          </Link>
          
          {/* Desktop Navigation */}
          <ul className='hidden md:flex'>
            <li className='mx-4'><Link to="/" className='hover:text-[#3674B5] transition-colors duration-200 cursor-pointer'>หน้าแรก</Link></li>
            <li className='mx-4'><Link to="/search" className='hover:text-[#3674B5] transition-colors duration-200 cursor-pointer'>แหล่งท่องเที่ยว</Link></li>
            <li className='mx-4'><Link to="/featured" className='hover:text-[#3674B5] transition-colors duration-200 cursor-pointer'>แผนเที่ยวคนอื่น</Link></li>
          </ul>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {user ? (
          <div className='hidden md:flex items-center gap-4'>
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
            <div className='relative' ref={dropdownRef}>
              <div 
                className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt={user.firstName} className='w-8 h-8 rounded-full' />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-[#E7F9FF] flex items-center justify-center'>
                    <User className='w-5 h-5 text-gray-500' />
                  </div>
                )}
                <span className='hidden md:block'>{user.firstName}</span>
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
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    บัญชีของฉัน
                  </Link>
                  <Link 
                    to="/create-plan" 
                    className='block px-4 py-2 hover:bg-gray-100'
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    สร้างแผนท่องเที่ยว
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer'
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ul className='hidden md:flex flex-row gap-3'>
            <Link to="/signin" className='cursor-pointer inline-block'>
              <Button variant="outline">เข้าสู่ระบบ</Button>
            </Link>
            <Link to="/signup" className='cursor-pointer inline-block'>
              <Button>สมัครสมาชิก</Button>
            </Link>  
          </ul>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
            <ul className="py-3">
              <li className="px-6 py-2">
                <Link to="/" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                  หน้าแรก
                </Link>
              </li>
              <li className="px-6 py-2">
                <Link to="/search" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                  แหล่งท่องเที่ยว
                </Link>
              </li>
              <li className="px-6 py-2">
                <Link to="/featured" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                  แผนเที่ยวคนอื่น
                </Link>
              </li>
              
              {user ? (
                <>
                  <li className="px-6 py-2">
                    <Link to="/dashboard" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                      บัญชีของฉัน
                    </Link>
                  </li>
                  <li className="px-6 py-2">
                    <Link to="/create-plan" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                      สร้างแผนท่องเที่ยว
                    </Link>
                  </li>
                  <li className="px-6 py-2">
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="block w-full text-left text-red-500"
                    >
                      ออกจากระบบ
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="px-6 py-2">
                    <Link to="/signin" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                      เข้าสู่ระบบ
                    </Link>
                  </li>
                  <li className="px-6 py-2">
                    <Link to="/signup" className="block hover:text-[#3674B5]" onClick={() => setShowMobileMenu(false)}>
                      สมัครสมาชิก
                    </Link>
                  </li>
                </>
              )}
              
              <li className="px-6 py-2">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="ค้นหาสถานที่ท่องเที่ยว..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#3674B5]"
                  />
                  <button
                    type="submit"
                    className="bg-[#3674B5] text-white px-3 py-2 rounded-r-lg"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;