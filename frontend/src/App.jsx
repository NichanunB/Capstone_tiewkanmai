import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ResetPassword from './pages/ResetPassword'
import SearchResultPage from './pages/SearchResultPage'
import SharedTravelPlanPage from './pages/SharedTravelPlanPage'
import PlaceDetailPage from './pages/PlaceDetailPage'
import TravelPlan from './components/TravelPlan'
import UserDashboard from './pages/UserDashboard'
import CreatePlanPage from './pages/CreatePlanPage'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/place/:id" element={<PlaceDetailPage />} />
          <Route path="/travel-plan/:id" element={<TravelPlan />} />
          <Route path="/featured" element={<SharedTravelPlanPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/create-plan" element={<CreatePlanPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
