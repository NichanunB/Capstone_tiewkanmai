import React from 'react';
import { Link } from 'react-router-dom';
import WhiteLogo from '../assets/logo-wh.png'
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { RiMessengerLine } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="bg-[#3674B5] text-white py-12">
      <div className="container mx-auto px-6 max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/">
              <img className='w-[200px] h-auto mb-4' src={WhiteLogo} alt="" />
            </Link>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaFacebookF size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="https://messenger.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <RiMessengerLine size={24} />
              </a>
            </div>
            <p className="text-gray-300">
              126 ถนนประชาอุทิศ แขวงบางมด เขตทุ่งครุ กทม. 10140
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            {/* <h3 className="text-xl font-semibold">ทางลัด</h3> */}
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">หน้าแรก</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-white">แหล่งท่องเที่ยว</Link></li>
              <li><Link to="/featured" className="text-gray-300 hover:text-white">แผนเที่ยวคนอื่น</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <ul className="space-y-2">
              <li><Link to="/create-plan" className="text-gray-300 hover:text-white">สร้างแผนเที่ยวใหม่</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white">ดูแผนการเที่ยวของตัวเอง</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white">สถานที่โปรด</Link></li>
            </ul>
          </div>          
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TiewKanMai. สงวนลิขสิทธิ์</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
