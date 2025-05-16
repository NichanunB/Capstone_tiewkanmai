// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลด token และข้อมูล user จาก localStorage
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await userService.getUserProfile();
          const userData = response.data;
          setUser({ ...userData, token }); // ✅ ใส่ token เข้าไปด้วย
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
      const userData = { id, firstName, lastName, email, token: accessToken };
      setUser(userData);

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

  const updateUserProfile = async (userData) => {
    try {
      const response = await userService.updateProfile(userData);
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
      const response = await userService.changePassword(passwordData);
      return { success: true, message: response.data.message };
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