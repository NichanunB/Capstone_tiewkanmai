import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const authService = {
  // ล็อกอิน
  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  },

  // สมัครสมาชิก
  register: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' };
    }
  },

  // ส่งอีเมลรีเซ็ตรหัสผ่าน
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน' };
    }
  },

  // รีเซ็ตรหัสผ่านด้วย token
  resetPassword: async (resetToken, newPassword) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
        token: resetToken,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' };
    }
  },

  // ตรวจสอบ token
  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token ไม่ถูกต้องหรือหมดอายุ' };
    }
  }
};

export default authService;
