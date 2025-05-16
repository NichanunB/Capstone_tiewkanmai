import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    profilePicture: null,
    profilePictureUrl: '',
  });

  // เมื่อ user ใน context เปลี่ยน (login/logout) ให้อัปเดต profileData
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '', // ถ้าไม่มี username backend ก็จะเป็นค่าว่าง
        email: user.email || '',
      }));
    }
  }, [user]);

  // เปลี่ยนรูปโปรไฟล์ (แสดง preview ชั่วคราว)
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profilePicture: file,
        profilePictureUrl: URL.createObjectURL(file),
      }));
    }
  };

  // เปลี่ยนค่าในฟอร์มแก้ไขโปรไฟล์
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ออกจากระบบ
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // เซฟโปรไฟล์ (ตัวอย่างเฉย ๆ)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('บันทึกโปรไฟล์สำเร็จ');
    // เมื่อเชื่อม backend จริง: อัปเดตข้อมูลใน backend แล้ว update user context ด้วย
    // เช่น await axios.put(...); setUser({...})
  };

  // ลบบัญชี (ตัวอย่าง)
  const handleDeleteAccount = () => {
    if (window.confirm('ต้องการลบบัญชีผู้ใช้?')) {
      alert('ลบบัญชีสำเร็จ');
      logout();
      navigate('/');
      // เมื่อเชื่อม backend จริง: await axios.delete(...);
    }
  };

  // ฟอร์มเปลี่ยนรหัสผ่าน (mock)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    alert('เปลี่ยนรหัสผ่านสำเร็จ');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    // เมื่อเชื่อม backend จริง: await axios.post(...);
  };

  // Sidebar menu
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

  // ========================== RENDER ==========================

  // ดูโปรไฟล์
  const renderProfileView = () => (
    <div className="space-y-8">
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
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {profileData.profilePictureUrl ? (
                <img src={profileData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
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
              {/* ถ้าไม่มี username จะแสดง - */}
              <p className="text-gray-600">@{profileData.username ? profileData.username : "-"}</p>
              <p className="text-gray-900">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-6">ตั้งค่าบัญชี</h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">เปลี่ยนรหัสผ่าน</label>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              placeholder="รหัสผ่านปัจจุบัน"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
            <input
              type="password"
              placeholder="รหัสผ่านใหม่"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3674B5] focus:border-[#3674B5]"
            />
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่านใหม่"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChangeInput}
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

  // ฟอร์มแก้ไขโปรไฟล์
  const renderProfileEdit = () => (
    <form onSubmit={handleSaveProfile} className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">แก้ไขโปรไฟล์</h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#2a5b8e] cursor-pointer"
            >
              บันทึก
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">รูปโปรไฟล์</label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {profileData.profilePictureUrl ? (
                <img src={profileData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
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
    </form>
  );

  // ----------------- MAIN RETURN -----------------
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
              <p className="text-gray-600">[รอเชื่อม backend จริง]</p>
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
              <p className="text-gray-600">[รอเชื่อม backend จริง]</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
