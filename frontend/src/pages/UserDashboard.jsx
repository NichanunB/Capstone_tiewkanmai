import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { planService } from '../services/api';
import { Plus } from 'lucide-react';
import { MOCK_ATTRACTIONS } from '../mockData/mockData';
import { MOCK_PLANS } from '../mockData/mock_plans';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const reloadParam = searchParams.get('reload');

  const [activeMenu, setActiveMenu] = useState('travel-plans');
  const [userPlans, setUserPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [favoriteAttractions, setFavoriteAttractions] = useState([]);
  const [favoritePlans, setFavoritePlans] = useState([]);

  useEffect(() => {
    if (activeMenu === 'travel-plans' || reloadParam === 'plans') {
      fetchUserPlans();
    } else if (activeMenu === 'favorites') {
      loadFavorites();
    }
  }, [activeMenu, reloadParam]);

  const fetchUserPlans = async () => {
    try {
      setLoadingPlans(true);
      
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      
      let allPlans = [...tempPlans];
      
      if (import.meta.env.MODE === 'development' && tempPlans.length > 0) {
      }
      
      setUserPlans(allPlans);
    } catch (error) {
      console.error('ไม่สามารถโหลดแผนท่องเที่ยว:', error);
      
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      setUserPlans(tempPlans);
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadFavorites = () => {
    const favoriteAttractionIds = JSON.parse(localStorage.getItem('favoriteAttractions') || '{}');
    const favoritedAttractionsData = Object.keys(favoriteAttractionIds)
      .filter(id => favoriteAttractionIds[id])
      .map(id => MOCK_ATTRACTIONS.find(attr => attr.id === parseInt(id)))
      .filter(attr => attr !== undefined);

    setFavoriteAttractions(favoritedAttractionsData);

    const favoritePlanIds = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    const favoritedPlansData = favoritePlanIds
      .map(id => MOCK_PLANS.find(plan => plan.id === parseInt(id)))
      .filter(plan => plan !== undefined);
    
    setFavoritePlans(favoritedPlansData);
  };

  useEffect(() => {
    if (reloadParam === 'plans') {
      setActiveMenu('travel-plans');
      loadUserPlans();
    }
  }, [reloadParam]);

  const loadUserPlans = () => {
    const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
    setUserPlans(tempPlans);
  };

  useEffect(() => {
    loadUserPlans();
    loadFavorites();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('ต้องการลบแผนท่องเที่ยวนี้?')) {
      console.log(`Deleting plan with ID: ${planId}`);
      
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      const updatedTempPlans = tempPlans.filter(plan => plan.id !== planId);
      localStorage.setItem('tempPlans', JSON.stringify(updatedTempPlans));
      
      setUserPlans(prev => prev.filter(plan => plan.id !== planId));
      
      const favoritePlans = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
      const updatedFavoritePlans = favoritePlans.filter(id => id !== planId);
      localStorage.setItem('favoritePlans', JSON.stringify(updatedFavoritePlans));
    }
  };

  const handleRemoveFavoriteAttraction = (attractionId) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteAttractions') || '{}');
    if (favorites[attractionId]) {
      delete favorites[attractionId];
      localStorage.setItem('favoriteAttractions', JSON.stringify(favorites));
      setFavoriteAttractions(prev => prev.filter(attr => attr.id !== attractionId));
    }
  };

  const handleRemoveFavoritePlan = (planId) => {
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    const updatedFavorites = favorites.filter(id => id !== planId);
    localStorage.setItem('favoritePlans', JSON.stringify(updatedFavorites));
    setFavoritePlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const menuItems = [
    {
      id: 'travel-plans',
      title: 'แผนท่องเที่ยวของฉัน',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'favorites',
      title: 'แหล่งท่องเที่ยวโปรด',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      title: 'โปรไฟล์ของฉัน',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    }
  ];

  const renderTravelPlans = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">แผนท่องเที่ยวของฉัน</h3>
        <Link to="/create-plan">
          <button className="bg-[#3674B5] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#2A5A8E]">
            <Plus className="w-5 h-5" />
            <span>สร้างแผนเที่ยว</span>
          </button>
        </Link>
      </div>
      
      {loadingPlans ? (
        <p className="text-gray-500 text-center py-10">กำลังโหลดแผนท่องเที่ยว...</p>
      ) : userPlans.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">คุณยังไม่มีแผนท่องเที่ยว</p>
          <Link to="/create-plan">
            <button className="bg-[#3674B5] text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-[#2A5A8E]">
              <Plus className="w-5 h-5" />
              <span>สร้างแผนเที่ยวใหม่</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {userPlans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h4 className="text-lg font-semibold">{plan.name}</h4>
                <p className="text-sm text-gray-500">{plan.note || 'ไม่มีโน้ต'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  สร้างเมื่อ: {new Date(plan.createdAt).toLocaleDateString('th-TH')}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/travel-plan/${plan.id}`}>
                  <button className="text-blue-500 hover:underline">ดู</button>
                </Link>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-500 hover:underline ml-4"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div>
      <h3 className="text-xl font-semibold mb-6">แหล่งท่องเที่ยวโปรด</h3>
      
      <h4 className="text-lg font-medium mb-4">สถานที่ท่องเที่ยว</h4>
      {favoriteAttractions.length === 0 ? (
        <p className="text-gray-500 mb-8">ยังไม่มีสถานที่ท่องเที่ยวในรายการโปรด</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {favoriteAttractions.map((place) => (
            <div key={place.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              {place.coverImage && (
                <img 
                  src={place.coverImage}
                  alt={place.name_th || place.name_en || 'ไม่มีรูป'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/300x200?text=${place.name_th || 'ไม่มีรูป'}`;
                  }}
                />
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold">{place.name_th || place.name_en || 'ไม่ระบุชื่อ'}</h4>
                <p className="text-sm text-gray-500">{place.province_th || 'ไม่ระบุจังหวัด'}</p>
                {place.category && (
                  <p className="text-sm text-gray-500">หมวดหมู่: {place.category}</p>
                )}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {place.description || 'ไม่มีรายละเอียด'}
                </p>
                <div className="mt-4 flex justify-between">
                  <Link to={`/place/${place.id}`}>
                    <button className="text-blue-500 hover:underline">ดูรายละเอียด</button>
                  </Link>
                  <button 
                    onClick={() => handleRemoveFavoriteAttraction(place.id)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    ลบออก
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h4 className="text-lg font-medium mb-4">แผนท่องเที่ยว</h4>
      {favoritePlans.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีแผนท่องเที่ยวในรายการโปรด</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritePlans.map((plan) => (
             <div key={plan.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              {plan.coverImage && (
                <img 
                  src={plan.coverImage}
                  alt={plan.title || 'แผนเที่ยว'}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold">{plan.title || 'ไม่มีชื่อแผน'}</h4>
                <p className="text-sm text-gray-500">โดย {plan.author || 'ไม่ระบุผู้สร้าง'}</p>
                 {plan.note && (
                   <p className="text-sm text-gray-600 mt-2 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    บันทึก: {plan.note}
                   </p>
                 )}
                <div className="mt-4 flex justify-between">
                  <Link to={`/shared-travel-plan/${plan.id}`}>
                    <button className="text-blue-500 hover:underline">ดูรายละเอียด</button>
                  </Link>
                  <button 
                    onClick={() => handleRemoveFavoritePlan(plan.id)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    ลบออก
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {favoriteAttractions.length === 0 && favoritePlans.length === 0 && (
          <div className="text-center py-10 text-gray-500">
              ยังไม่มีรายการโปรด ทั้งสถานที่ท่องเที่ยวและแผนท่องเที่ยว
          </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div>
      <h3 className="text-xl font-semibold mb-6">ข้อมูลโปรไฟล์</h3>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <p className="text-gray-600">ชื่อ-นามสกุล</p>
          <p className="font-medium">{user?.firstName || 'ผู้ใช้'} {user?.lastName || 'ตัวอย่าง'}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">อีเมล</p>
          <p className="font-medium">{user?.email || 'user@example.com'}</p>
        </div>
        <button className="bg-[#3674B5] text-white px-4 py-2 rounded-lg mt-4">
          แก้ไขโปรไฟล์
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg flex flex-col h-full">
        <div className="p-4">
          <div className="flex justify-center mb-8">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#3674B5]">TiewKanMai</h1>
            </Link>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">แดชบอร์ดผู้ใช้งาน</h2>
          <nav>
            {menuItems.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeMenu === menu.id
                    ? 'bg-[#3674B5]/10 text-[#3674B5]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {menu.icon}
                <span className="font-medium">{menu.title}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 mt-auto">
          <Link to="/" className="w-full block text-left px-4 py-3 rounded-lg text-[#3674B5] font-semibold hover:bg-[#3674B5]/10 transition-colors mb-2">ไปที่หน้าแรก</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-red-500 font-semibold hover:bg-red-50 transition-colors cursor-pointer">ออกจากระบบ</button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeMenu === 'travel-plans' && renderTravelPlans()}
          {activeMenu === 'favorites' && renderFavorites()}
          {activeMenu === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;