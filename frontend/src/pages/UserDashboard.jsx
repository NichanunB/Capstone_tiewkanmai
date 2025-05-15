import React, { useState } from 'react';
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'สมชาย',
    lastName: 'รักเรียน',
    username: 'somchai123',
    email: 'somchai@example.com',
    profilePicture: null
  });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profilePicture: URL.createObjectURL(file)
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password change logic here
  };

  const handleDeleteAccount = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้งานของคุณ การลบบัญชีจะไม่สามารถกู้คืนได้')) {
      // Add account deletion logic here
    }
  };

  const handleSaveProfile = () => {
    // Add save profile logic here
    setIsEditing(false);
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <div className="space-y-8">
      {/* Profile View Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">ข้อมูลโปรไฟล์</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#2a5b8e] flex items-center space-x-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>แก้ไขโปรไฟล์</span>
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-lg font-medium">{profileData.firstName} {profileData.lastName}</h4>
              <p className="text-gray-600">@{profileData.username}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">ชื่อ</h5>
              <p className="text-gray-900">{profileData.firstName}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">นามสกุล</h5>
              <p className="text-gray-900">{profileData.lastName}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">ชื่อผู้ใช้</h5>
              <p className="text-gray-900">@{profileData.username}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-1">อีเมล</h5>
              <p className="text-gray-900">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-6">ตั้งค่าบัญชี</h3>
        
        {/* Password Change */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">เปลี่ยนรหัสผ่าน</label>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              placeholder="รหัสผ่านปัจจุบัน"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
            <input
              type="password"
              placeholder="รหัสผ่านใหม่"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่านใหม่"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#2a5b8e] cursor-pointer"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            ลบบัญชีผู้ใช้
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfileEdit = () => (
    <div className="space-y-8">
      {/* Profile Settings Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">แก้ไขโปรไฟล์</h3>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#2a5b8e] cursor-pointer"
            >
              บันทึก
            </button>
          </div>
        </div>
        
        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">รูปโปรไฟล์</label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
              id="profile-picture"
            />
            <label
              htmlFor="profile-picture"
              className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#2a5b8e] cursor-pointer"
            >
              เปลี่ยนรูปโปรไฟล์
            </label>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
          </div>
        </div>

        {/* Username */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeMenu === 'profile' && (
            isEditing ? renderProfileEdit() : renderProfileView()
          )}
          {activeMenu === 'favorites' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">แหล่งท่องเที่ยวโปรด</h3>
              <p className="text-gray-600">ดูและจัดการแหล่งท่องเที่ยวที่คุณชื่นชอบได้ที่นี่</p>
            </div>
          )}
          {activeMenu === 'travel-plans' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">แผนท่องเที่ยวของฉัน</h3>
                <Link to="/create-plan" className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#3674B5]/90 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>สร้างแผนท่องเที่ยวใหม่</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample Travel Plan Card */}
                <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold">เที่ยวเชียงใหม่</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">กำลังจะมาถึง</span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      15-20 มีนาคม 2024
                    </p>
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      5 สถานที่
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 text-sm text-[#3674B5] hover:bg-[#3674B5]/10 rounded">แก้ไข</button>
                    <button className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded">ลบ</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
