import React from 'react';
import { Link } from 'react-router-dom';
import WhiteLogo from '../assets/logo-wh.png'

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
            <p className="text-gray-300">
              126 Pracha Uthit Rd., Bang Mod, Thung Khru, Bangkok 10140, Thailand
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white">Destinations</Link></li>
              <li><Link to="/featured" className="text-gray-300 hover:text-white">Featured Plans</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>          
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TiewKanMai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
