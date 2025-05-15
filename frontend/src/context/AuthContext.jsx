// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบ token ใน localStorage เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // ดึงข้อมูลผู้ใช้จาก token
          const response = await userService.getUserProfile();
          setUser(response.data);
        } catch (error) {
          console.error("Token invalid:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { accessToken, id, firstName, lastName, email } = response.data;
      
      localStorage.setItem('token', accessToken);
      setUser({ id, firstName, lastName, email });
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "การเข้าสู่ระบบล้มเหลว" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "การสมัครสมาชิกล้มเหลว" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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