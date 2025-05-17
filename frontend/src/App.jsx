// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import SearchResultPage from './pages/SearchResultPage';
import SharedTravelPlanPage from './pages/shared-travel-plan/SharedTravelPlan';
import SharedTravelPlanDetailPage from './pages/shared-travel-plan/SharedTravelPlanDetailPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import TravelPlan from './components/TravelPlan';
import UserDashboard from './pages/UserDashboard';
import CreatePlanPage from './pages/CreatePlanPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserPlanDetailPage from './pages/UserPlanDetailPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* เส้นทางสาธารณะ */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/place/:id" element={<PlaceDetailPage />} />
          <Route path="/travel-plan/:id" element={<TravelPlan />} />
          <Route path="/featured" element={<SharedTravelPlanPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/shared-travel-plan/:id" element={<SharedTravelPlanDetailPage />} />
          
          {/* เส้นทางที่ต้องล็อกอิน */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-plan" 
            element={
              <ProtectedRoute>
                <CreatePlanPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-travel-plan/:id" 
            element={
              <ProtectedRoute>
                <UserPlanDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shared-travel-plan/:id" 
            element={
              <ProtectedRoute>
                <UserPlanDetailPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;