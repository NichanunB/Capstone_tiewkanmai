// src/services/longdoMapService.js
import api from './api';

// สำหรับกรณีที่บน backend ได้ทำ proxy ให้บริการ Longdo API แล้ว
const longdoMapService = {
  searchPlaces: (keyword, params) => 
    api.get('/maps/places', { params: { keyword, ...params }}),
    
  getTouristPlacesByProvince: (province, category, limit) => 
    api.get('/maps/tourist-places', { params: { province, category, limit }}),
    
  getPlaceDetails: (id) => 
    api.get(`/maps/place/${id}`),
  
  getRoute: (origin, destination, mode) => 
    api.get('/maps/route', { params: { origin, destination, mode }}),
    
  generatePlan: (province, categories, days) => 
    api.get('/maps/generate-plan', { params: { province, categories, days }})
};

export default longdoMapService;