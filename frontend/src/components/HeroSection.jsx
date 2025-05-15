import React from 'react';
import SearchBar from './Searchbar';

const HeroSection = () => {
  return (
    <div className="hero-image min-h-screen flex items-center justify-center pt-20 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            เที่ยวกันไหม
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
            ไปเที่ยวกันไหม จะไปก็รีบไป ไปกับพี่แล้วสบาย
          </p>
        </div>
        
        <SearchBar />
        
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-white">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center w-44">
            <p className="text-sm">มีแหล่งท่องเที่ยวกว่า</p>
            <p className="font-bold text-2xl">2500+</p>
            <p className="text-sm">แห่ง</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center w-44">
            <p className="text-sm">มีผู้ใช้งานกว่า</p>
            <p className="font-bold text-2xl">10K+</p>
            <p className="text-sm">คน</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
