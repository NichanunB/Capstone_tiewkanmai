import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import TravelPlanSection from '../components/TravelPlanSection'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className='bg-[#E7F9FF]'>
        <Navbar />
        <HeroSection />
        <TravelPlanSection />
        <Footer />
    </div>
  )
}

export default Home