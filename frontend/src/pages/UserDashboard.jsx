// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { planService, userService } from '../services/api';

const UserDashboard = () => {
  const { user, logout, updateUserProfile } = useAuth(); // ❌ ลบ changePassword ออก
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const reloadParam = searchParams.get('reload');

  const [activeMenu, setActiveMenu] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: '',
    email: user?.email || '',
    profilePicture: null,
    profilePictureUrl: '',
  });

  const [userPlans, setUserPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [favoriteList, setFavoriteList] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getUserProfile();
        const userData = response.data;

        setProfileData(prev => ({
          ...prev,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || '',
          profilePictureUrl: userData.profilePicture || '',
        }));
      } catch (err) {
        console.error('ไม่สามารถโหลดข้อมูลโปรไฟล์:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchUserPlans = async () => {
      if (activeMenu === 'travel-plans' || reloadParam === 'plans') {
        try {
          setLoadingPlans(true);
          const response = await planService.getUserPlans();
          setUserPlans(response.data);
        } catch (err) {
          console.error('ไม่สามารถโหลดแผนท่องเที่ยว:', err);
        } finally {
          setLoadingPlans(false);
        }
      }
    };

    fetchUserPlans();
  }, [activeMenu, reloadParam]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeMenu === 'favorites') {
        try {
          setLoadingFavorites(true);
          setFavoriteList([
            {
              id: 1,
              name: "วัดพระแก้ว",
              image: "https://placehold.co/300x200?text=Temple",
              description: "พระบรมมหาราชวัง",
              province: "กรุงเทพมหานคร"
            },
            {
              id: 2,
              name: "เยาวราช",
              image: "https://placehold.co/300x200?text=Chinatown",
              description: "ย่านการค้าและอาหารจีนที่ใหญ่ที่สุดในกรุงเทพฯ",
              province: "กรุงเทพมหานคร"
            }
          ]);
        } catch (err) {
          console.error('ไม่สามารถโหลดรายการโปรด:', err);
        } finally {
          setLoadingFavorites(false);
        }
      }
    };

    fetchFavorites();
  }, [activeMenu]);

  useEffect(() => {
    if (reloadParam === 'plans') {
      setActiveMenu('travel-plans');
    }
  }, [reloadParam]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      });

      if (result.success) {
        setIsEditing(false);
      } else {
        alert(result.message || 'ไม่สามารถบันทึกโปรไฟล์ได้');
      }
    } catch (err) {
      console.error('ไม่สามารถบันทึกโปรไฟล์:', err);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('ต้องการลบแผนท่องเที่ยวนี้?')) {
      try {
        await planService.deletePlan(planId);
        setUserPlans(prev => prev.filter(plan => plan.id !== planId));
      } catch (err) {
        console.error('ไม่สามารถลบแผนท่องเที่ยว:', err);
      }
    }
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'โปรไฟล์ของฉัน',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
      id: 'travel-plans',
      title: 'แผนท่องเที่ยวของฉัน',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    }
  ];

  const renderProfileView = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">ข้อมูลโปรไฟล์</h3>
      <p><strong>ชื่อ:</strong> {profileData.firstName} {profileData.lastName}</p>
      <p><strong>Email:</strong> {profileData.email}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setIsEditing(true)}
      >
        แก้ไขโปรไฟล์
      </button>
    </div>
  );

  const renderProfileEdit = () => (
    <form onSubmit={handleSaveProfile}>
      <h3 className="text-xl font-semibold mb-4">แก้ไขโปรไฟล์</h3>
      <div className="mb-4">
        <label className="block">ชื่อ</label>
        <input
          type="text"
          name="firstName"
          value={profileData.firstName}
          onChange={handleInputChange}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block">นามสกุล</label>
        <input
          type="text"
          name="lastName"
          value={profileData.lastName}
          onChange={handleInputChange}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block">Email</label>
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="flex space-x-4">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          บันทึก
        </button>
        <button type="button" className="px-4 py-2 bg-gray-300 text-black rounded" onClick={() => setIsEditing(false)}>
          ยกเลิก
        </button>
      </div>
    </form>
  );

  const renderTravelPlans = () => (
    <div>
      <h3 className="text-xl font-semibold mb-6">แผนท่องเที่ยวของฉัน</h3>
      {loadingPlans ? (
        <p className="text-gray-500">กำลังโหลดแผนท่องเที่ยว...</p>
      ) : userPlans.length === 0 ? (
        <p className="text-gray-500">คุณยังไม่มีแผนท่องเที่ยว</p>
      ) : (
        <ul className="space-y-4">
          {userPlans.map((plan) => (
            <li key={plan.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{plan.name}</h4>
                <p className="text-sm text-gray-500">{plan.note}</p>
              </div>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="text-red-500 hover:underline"
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div>
      <h3 className="text-xl font-semibold mb-6">แหล่งท่องเที่ยวโปรด</h3>
      {loadingFavorites ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : favoriteList.length === 0 ? (
        <p className="text-gray-500">คุณยังไม่มีสถานที่โปรด</p>
      ) : (
        <ul className="space-y-4">
          {favoriteList.map((place) => (
            <li key={place.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{place.name}</h4>
                <p className="text-sm text-gray-500">{place.province}</p>
                <p className="text-sm text-gray-600">{place.description}</p>
              </div>
              <button
                onClick={() => {
                  setFavoriteList(prev => prev.filter(item => item.id !== place.id));
                }}
                className="text-red-500 hover:underline"
              >
                ลบออก
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between h-full">
        <div className="p-4">
          <div className="flex justify-center mb-8 m-8">
            <img src={logo} alt="Logo" className="h-auto w-42 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">แดชบอร์ดผู้ใช้งาน</h2>
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
        <div className="p-4">
          <Link to="/" className="w-full block text-left px-4 py-3 rounded-lg text-[#3674B5] font-semibold hover:bg-[#3674B5]/10 transition-colors mb-2">ไปที่หน้าแรก</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-red-500 font-semibold hover:bg-red-50 transition-colors cursor-pointer">ออกจากระบบ</button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeMenu === 'profile' && (
            isEditing ? renderProfileEdit() : renderProfileView()
          )}
          {activeMenu === 'favorites' && renderFavorites()}
          {activeMenu === 'travel-plans' && renderTravelPlans()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
