// src/services/api.js
import axios from 'axios';

// กำหนด base URL ของ API
const API_URL = 'http://localhost:8080/api';

// สร้าง axios instance สำหรับใช้งานทั่วไป
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services สำหรับการเรียกใช้ API ต่างๆ
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const placeService = {
  getAllPlaces: () => api.get('/places'),
  getPlaceById: (id) => api.get(`/places/${id}`),
  getPlacesByProvince: (provinceId) => api.get(`/places?province=${provinceId}`),
  getPlacesByCategory: (categoryId) => api.get(`/places?category=${categoryId}`),
  getRelatedPlaces: (placeId) => api.get(`/places/${placeId}/related`),
};

export const planService = {
  getUserPlans: () => api.get('/plans'),
  getPlanById: (id) => api.get(`/plans/${id}`),
  createPlan: (planData) => api.post('/plans', planData),
  updatePlan: (id, planData) => api.put(`/plans/${id}`, planData),
  deletePlan: (id) => api.delete(`/plans/${id}`),
  generatePlan: (requestData) => api.post('/plans/generate', requestData),
};

export const categoryService = {
  getAllCategories: () => api.get('/categories'),
};

export const provinceService = {
  getAllProvinces: () => api.get('/provinces'),
  getProvincesByRegion: (regionId) => api.get(`/provinces?region=${regionId}`),
};

export const regionService = {
  getAllRegions: () => api.get('/regions'),
};

export const userService = {
  getUserProfile: () => api.get('/user'),
  updateProfile: (userData) => api.put('/user', userData),
  changePassword: (passwordData) => api.put('/user/password', passwordData),
};

export default api;