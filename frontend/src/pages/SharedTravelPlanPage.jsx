import React from 'react'
import Navbar from '../components/Navbar'
import SharedTravelPlan from '../components/SharedTravelPlan'
import Footer from '../components/Footer'

function SharedTravelPlanPage() {
  return (
    <div className='bg-[#E7F9FF]'>
        <Navbar />
        <SharedTravelPlan />
        <Footer />
    </div>
  )
}

export default SharedTravelPlanPage