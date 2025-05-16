// src/services/planService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// ทุกฟังก์ชันต้องส่ง token มาด้วย (สำหรับ auth)

const planService = {
  // ดึงแผนท่องเที่ยวทั้งหมดของ user (กรณี backend return เฉพาะของ user ปัจจุบัน)
  getMyPlans: async (token) => {
    const res = await axios.get(`${BASE_URL}/plans/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; // [{id, title, ...}, ...]
  },

  // ดึงแผนเที่ยวทีละอัน (ใช้ตอนดูรายละเอียด/แก้ไข)
  getPlanById: async (planId, token) => {
    const res = await axios.get(`${BASE_URL}/plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // สร้างแผนเที่ยวใหม่
  createPlan: async (planData, token) => {
    const res = await axios.post(`${BASE_URL}/plans`, planData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // อัปเดตแผนเที่ยว
  updatePlan: async (planId, planData, token) => {
    const res = await axios.put(`${BASE_URL}/plans/${planId}`, planData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },

  // ลบแผนเที่ยว
  deletePlan: async (planId, token) => {
    const res = await axios.delete(`${BASE_URL}/plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};

export default planService;
