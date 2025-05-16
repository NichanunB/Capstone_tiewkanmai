import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// สร้าง axios instance สำหรับใส่ token
const createAuthHeader = (token) => {
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

const userService = {
  // ดึงข้อมูลโปรไฟล์
  getProfile: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/profile`, createAuthHeader(token));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้' };
    }
  },

  // อัปเดตข้อมูลโปรไฟล์
  updateProfile: async (profileData, token) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/profile`, 
        profileData, 
        createAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'ไม่สามารถอัปเดตโปรไฟล์ได้' };
    }
  },

  // อัปโหลดรูปโปรไฟล์
  uploadProfilePicture: async (file, token) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await axios.post(
        `${BASE_URL}/users/profile/picture`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'ไม่สามารถอัปโหลดรูปโปรไฟล์ได้' };
    }
  },

  // เปลี่ยนรหัสผ่าน
  changePassword: async (passwordData, token) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/users/password`,
        passwordData,
        createAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'ไม่สามารถเปลี่ยนรหัสผ่านได้' };
    }
  },

  // ลบบัญชีผู้ใช้
  deleteAccount: async (token) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/users/account`,
        createAuthHeader(token)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'ไม่สามารถลบบัญชีผู้ใช้ได้' };
    }
  }
};

export default userService;
