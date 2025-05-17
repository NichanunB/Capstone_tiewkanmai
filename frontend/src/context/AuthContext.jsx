// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // กำหนด Axios global defaults สำหรับการส่ง token ในทุก request
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return () => {
      delete axios.defaults.headers.common['Authorization'];
    };
  }, []);

  // โหลด token และข้อมูล user จาก localStorage
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          console.log("Verifying token from localStorage");
          // กำหนด header ชั่วคราวสำหรับการตรวจสอบ token
          // eslint-disable-next-line no-undef
          const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/dev/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log("Token verification successful:", response.data);
          const userData = response.data;
          
          // กำหนดค่า user context และตั้งค่า axios default headers
          setUser({ ...userData, token });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Token invalid, removing from localStorage:", error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        console.log("No token found in localStorage");
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Sending login request to backend...");
      
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      
      // ใช้ axios โดยตรงแทนการใช้ authService เพื่อการตรวจสอบปัญหา
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Login response received:", response.data);
      
      // เก็บข้อมูลจาก response
      const { accessToken, id, firstName, lastName, email } = response.data;
      
      // บันทึก token ลงใน localStorage
      localStorage.setItem('token', accessToken);
      
      // ตั้งค่า default Authorization header สำหรับ axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // อัปเดต user context
      const userData = { id, firstName, lastName, email, token: accessToken };
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Login error details:", error);
      
      // ตรวจสอบ error ต่างๆ
      if (error.message === 'Network Error') {
        return {
          success: false,
          message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อเครือข่าย"
        };
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "การเข้าสู่ระบบล้มเหลว"
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log("Sending registration request:", userData);
      
      // ใช้ authService จากไฟล์ที่ส่งมาใหม่
      const response = await authService.register(userData);
      
      console.log("Registration response:", response);
      return { success: true, message: response.message || "ลงทะเบียนสำเร็จ" };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "การสมัครสมาชิกล้มเหลว"
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUserProfile = async (userData) => {
    try {
      // อัปเดต endpoint ให้ตรงกับ backend ที่มี
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await axios.put(`${BASE_URL}/dev/user/profile`, userData);
      
      setUser(prev => ({ ...prev, ...response.data }));
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "การอัปเดตโปรไฟล์ล้มเหลว"
      };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      // อัปเดต endpoint ให้ตรงกับ backend ที่มี
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await axios.post(`${BASE_URL}/dev/user/change-password`, passwordData);
      
      return { success: true, message: response.data.message || "เปลี่ยนรหัสผ่านสำเร็จ" };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "การเปลี่ยนรหัสผ่านล้มเหลว"
      };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        loading,
        updateUserProfile,
        changePassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};