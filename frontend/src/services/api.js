// src/services/api.js
import axios from 'axios';
import {
  MOCK_ATTRACTIONS,
  MOCK_PLANS,
  MOCK_CATEGORIES,
  MOCK_PROVINCES,
  MOCK_REGIONS
} from '../mockData/mockData.js';




// กำหนด base URL ของ API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ตัวแปรเช็คว่าใช้ mock data หรือไม่
const useMock = import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MOCK === 'true';

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
      console.log(`Adding token for request to: ${config.url}`);
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log(`No token available for request to: ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`API Error for ${error.config?.url || 'unknown endpoint'}:`, 
      error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Services สำหรับการเรียกใช้ API ต่างๆ
export const authService = {
  login: (credentials) => {
    if (useMock) {
      console.log("Using mock data for login");
      // จำลองการล็อกอิน
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'test@example.com' && credentials.password === 'password') {
            localStorage.setItem('token', 'mock-token-123456');
            resolve({ 
              data: { 
                token: 'mock-token-123456',
                user: {
                  id: 1,
                  name: 'ผู้ใช้ทดสอบ',
                  email: 'test@example.com'
                }
              } 
            });
          } else {
            reject({ 
              response: { 
                status: 401, 
                data: { message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' } 
              } 
            });
          }
        }, 500);
      });
    }
    return api.post('/auth/login', credentials);
  },
  
  register: (userData) => {
    if (useMock) {
      console.log("Using mock data for register");
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.setItem('token', 'mock-token-new-user');
          resolve({ 
            data: { 
              token: 'mock-token-new-user',
              user: {
                id: Date.now(),
                name: userData.name,
                email: userData.email
              }
            } 
          });
        }, 500);
      });
    }
    return api.post('/auth/register', userData);
  },
};

export const placeService = {
  getAllPlaces: (params) => {
    if (useMock) {
      console.log("Using mock data for getAllPlaces");
      // กรองข้อมูลตาม params ถ้ามี
      let filteredPlaces = [...MOCK_ATTRACTIONS];
      
      if (params) {
        if (params.province) {
          filteredPlaces = filteredPlaces.filter(p => 
            p.province_id === params.province || p.province === params.province
          );
        }
        if (params.category) {
          filteredPlaces = filteredPlaces.filter(p => 
            p.category_id === params.category || p.category === params.category
          );
        }
        if (params.limit) {
          filteredPlaces = filteredPlaces.slice(0, parseInt(params.limit));
        }
      }
      
      return Promise.resolve({ data: filteredPlaces });
    }
    return api.get('/places', { params });
  },
  
  getPlaceById: (id) => {
    if (useMock) {
      console.log(`Using mock data for getPlaceById: ${id}`);
      const place = MOCK_ATTRACTIONS.find(p => p.id === parseInt(id));
      return Promise.resolve({ data: place || null });
    }
    return api.get(`/places/${id}`);
  },
  
  getPlacesByProvince: (provinceId) => {
    if (useMock) {
      console.log(`Using mock data for getPlacesByProvince: ${provinceId}`);
      const places = MOCK_ATTRACTIONS.filter(p => 
        p.province_id === provinceId || 
        (typeof provinceId === 'string' && p.province === provinceId) ||
        (MOCK_PROVINCES.find(prov => prov.id === parseInt(provinceId))?.name === p.province)
      );
      return Promise.resolve({ data: places });
    }
    return api.get(`/places?province=${provinceId}`);
  },
  
  getPlacesByCategory: (categoryId) => {
    if (useMock) {
      console.log(`Using mock data for getPlacesByCategory: ${categoryId}`);
      const places = MOCK_ATTRACTIONS.filter(p => 
        p.category_id === categoryId ||
        (typeof categoryId === 'string' && p.category === categoryId) ||
        (MOCK_CATEGORIES.find(cat => cat.id === parseInt(categoryId))?.name === p.category)
      );
      return Promise.resolve({ data: places });
    }
    return api.get(`/places?category=${categoryId}`);
  },
  
  getRelatedPlaces: (placeId) => {
    if (useMock) {
      console.log(`Using mock data for getRelatedPlaces: ${placeId}`);
      const place = MOCK_ATTRACTIONS.find(p => p.id === parseInt(placeId));
      if (place) {
        const relatedPlaces = MOCK_ATTRACTIONS.filter(p => 
          p.id !== parseInt(placeId) && p.province === place.province
        ).slice(0, 3);
        return Promise.resolve({ data: relatedPlaces });
      }
      return Promise.resolve({ data: [] });
    }
    return api.get(`/places/${placeId}/related`);
  },
  
  getNearbyPlaces: (lat, lng, radius) => {
    if (useMock) {
      console.log(`Using mock data for getNearbyPlaces`);
      // สุ่มเลือกข้อมูลมาแสดงในกรณี mock data
      const randomPlaces = [...MOCK_ATTRACTIONS]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      return Promise.resolve({ data: randomPlaces });
    }
    return api.get(`/places/nearby?lat=${lat}&lng=${lng}&radius=${radius || 5}`);
  },
  
  searchPlaces: (query) => {
    console.log(`Searching places with query: "${query}"`);
    
    if (useMock) {
      console.log("Using mock data for place search");
      // ค้นหาจากชื่อหรือคำอธิบายหรือจังหวัด
      const filteredPlaces = MOCK_ATTRACTIONS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        (p.name_en && p.name_en.toLowerCase().includes(query.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase())) ||
        p.province.toLowerCase().includes(query.toLowerCase())
      );
      return Promise.resolve({ data: filteredPlaces });
    }
    
    // ลองใช้ API endpoint หลายแบบตามลำดับ หากไม่สำเร็จจะลองแบบถัดไป
    return api.get(`/places/search?query=${encodeURIComponent(query)}`)
      .catch(() => {
        console.log("First endpoint failed, trying alternative...");
        // ลองใช้ endpoint ทางเลือกถ้า endpoint แรกไม่ทำงาน
        return api.get(`/maps/places?keyword=${encodeURIComponent(query)}`);
      })
      .catch(() => {
        console.log("Second endpoint failed, trying third alternative...");
        // ลองใช้ endpoint สุดท้ายถ้าทั้งสองแบบแรกไม่ทำงาน
        return api.get(`/dev/places/search?q=${encodeURIComponent(query)}`);
      })
      .catch(() => {
        console.error("All endpoints failed, returning mock data");
        // ถ้าไม่มี endpoint ไหนทำงาน ให้ใช้ข้อมูลจำลอง
        return {
          data: [
            { id: 1, name: "วัดพระแก้ว", province: "กรุงเทพมหานคร", image: "https://placehold.co/300x200?text=วัดพระแก้ว" },
            { id: 2, name: "เยาวราช", province: "กรุงเทพมหานคร", image: "https://placehold.co/300x200?text=เยาวราช" }
          ]
        };
      });
  },
};

export const planService = {
  getUserPlans: () => {
    if (useMock) {
      console.log("Using mock data for getUserPlans");
      // ดึงข้อมูลจาก localStorage หรือจาก mock data
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      const allPlans = [...MOCK_PLANS, ...tempPlans];
      return Promise.resolve({ data: allPlans });
    }
    return api.get('/plans');
  },
  
  getPlanById: (id) => {
    if (useMock) {
      console.log(`Using mock data for getPlanById: ${id}`);
      // ค้นหาจาก mock data
      let plan = MOCK_PLANS.find(p => p.id === parseInt(id));
      
      // ถ้าไม่เจอให้ค้นหาจาก localStorage
      if (!plan) {
        const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
        plan = tempPlans.find(p => p.id === parseInt(id));
      }
      
      return Promise.resolve({ data: plan || null });
    }
    return api.get(`/plans/${id}`);
  },
  
  createPlan: (planData) => {
    if (useMock) {
      console.log("Using mock data for createPlan");
      // จำลองการบันทึกข้อมูลลง localStorage
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      const newPlan = {
        id: Date.now(),
        title: planData.name || planData.title,
        coverImage: planData.coverImage || planData.img,
        note: planData.note || "",
        jsonData: planData.jsonData,
        createdAt: new Date().toISOString()
      };
      tempPlans.push(newPlan);
      localStorage.setItem('tempPlans', JSON.stringify(tempPlans));
      
      // จำลอง delay เหมือนเรียก API จริง
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: newPlan });
        }, 500);
      });
    }
    
    // ปรับโครงสร้างข้อมูลให้ตรงกับที่ backend ต้องการ
    const adjustedData = {
      title: planData.name || planData.title, 
      coverImage: planData.coverImage || planData.img, 
      note: planData.note || "",
      jsonData: planData.jsonData
    };
    
    console.log("Creating plan with data:", adjustedData);
    return api.post('/plans', adjustedData);
  },
  
  updatePlan: (id, planData) => {
    if (useMock) {
      console.log(`Using mock data for updatePlan: ${id}`);
      
      // ค้นหาแผนที่จะอัปเดตใน tempPlans
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      const planIndex = tempPlans.findIndex(p => p.id === parseInt(id));
      
      if (planIndex !== -1) {
        // อัปเดตแผนใน tempPlans
        const updatedPlan = {
          ...tempPlans[planIndex],
          title: planData.name || planData.title,
          coverImage: planData.coverImage || planData.img,
          note: planData.note || "",
          jsonData: planData.jsonData,
          updatedAt: new Date().toISOString()
        };
        
        tempPlans[planIndex] = updatedPlan;
        localStorage.setItem('tempPlans', JSON.stringify(tempPlans));
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: updatedPlan });
          }, 500);
        });
      } else {
        // ถ้าไม่เจอในแผนที่บันทึกล่าสุด ค้นหาใน MOCK_PLANS
        const mockPlanIndex = MOCK_PLANS.findIndex(p => p.id === parseInt(id));
        
        if (mockPlanIndex !== -1) {
          // สร้างแผนใหม่ใน tempPlans แทนที่จะแก้ไข mock data
          const newPlan = {
            ...MOCK_PLANS[mockPlanIndex],
            id: Date.now(), // ให้ ID ใหม่เพื่อหลีกเลี่ยงการทับซ้อน
            title: planData.name || planData.title,
            coverImage: planData.coverImage || planData.img,
            note: planData.note || "",
            jsonData: planData.jsonData,
            updatedAt: new Date().toISOString()
          };
          
          tempPlans.push(newPlan);
          localStorage.setItem('tempPlans', JSON.stringify(tempPlans));
          
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({ data: newPlan });
            }, 500);
          });
        }
        
        // ถ้าไม่เจอแผนที่ต้องการแก้ไข ส่ง error
        return Promise.reject({
          response: {
            status: 404,
            data: { message: 'ไม่พบแผนที่ต้องการแก้ไข' }
          }
        });
      }
    }
    
    // ปรับโครงสร้างข้อมูลให้ตรงกับที่ backend ต้องการ
    const adjustedData = {
      title: planData.name || planData.title, 
      coverImage: planData.coverImage || planData.img, 
      note: planData.note || "",
      jsonData: planData.jsonData
    };
    
    return api.put(`/plans/${id}`, adjustedData);
  },
  
  deletePlan: (id) => {
    if (useMock) {
      console.log(`Using mock data for deletePlan: ${id}`);
      
      // ลบแผนจาก tempPlans
      const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      const newTempPlans = tempPlans.filter(p => p.id !== parseInt(id));
      localStorage.setItem('tempPlans', JSON.stringify(newTempPlans));
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 500);
      });
    }
    return api.delete(`/plans/${id}`);
  },
  
  getAllPublicPlans: (sort) => {
    if (useMock) {
      console.log(`Using mock data for getAllPublicPlans`);
      
      let publicPlans = [...MOCK_PLANS];
      
      // เรียงลำดับตามเงื่อนไข sort
      if (sort === 'recent') {
        publicPlans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === 'popular') {
        // จำลองการเรียงตามความนิยม โดยสุ่มค่า
        publicPlans.sort(() => 0.5 - Math.random());
      }
      
      return Promise.resolve({ data: publicPlans });
    }
    return api.get(`/plans/public${sort ? `?sort=${sort}` : ''}`);
  },
};

export const categoryService = {
  getAllCategories: () => {
    if (useMock) {
      console.log("Using mock data for getAllCategories");
      return Promise.resolve({ data: MOCK_CATEGORIES });
    }
    return api.get('/categories');
  },
};

export const provinceService = {
  getAllProvinces: () => {
    if (useMock) {
      console.log("Using mock data for getAllProvinces");
      return Promise.resolve({ data: MOCK_PROVINCES });
    }
    return api.get('/provinces');
  },
  
  getProvincesByRegion: (regionId) => {
    if (useMock) {
      console.log(`Using mock data for getProvincesByRegion: ${regionId}`);
      const provinces = MOCK_PROVINCES.filter(p => p.region_id === parseInt(regionId));
      return Promise.resolve({ data: provinces });
    }
    return api.get(`/provinces?region=${regionId}`);
  },
};

export const regionService = {
  getAllRegions: () => {
    if (useMock) {
      console.log("Using mock data for getAllRegions");
      return Promise.resolve({ data: MOCK_REGIONS });
    }
    return api.get('/regions');
  },
};

export const userService = {
  getUserProfile: () => {
    if (useMock) {
      console.log("Using mock data for getUserProfile");
      
      // ตรวจสอบว่ามี token หรือไม่
      const token = localStorage.getItem('token');
      if (!token) {
        return Promise.reject({
          response: {
            status: 401,
            data: { message: 'ไม่ได้เข้าสู่ระบบ' }
          }
        });
      }
      
      return Promise.resolve({
        data: {
          id: 1,
          name: 'ผู้ใช้ทดสอบ',
          email: 'test@example.com',
          avatar: 'https://via.placeholder.com/150',
          createdAt: '2023-01-01T00:00:00Z'
        }
      });
    }
    return api.get('/user');
  },
  
  updateProfile: (userData) => {
    if (useMock) {
      console.log("Using mock data for updateProfile");
      return Promise.resolve({
        data: {
          id: 1,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || 'https://via.placeholder.com/150',
          updatedAt: new Date().toISOString()
        }
      });
    }
    return api.put('/user', userData);
  },
  
  changePassword: (passwordData) => {
    if (useMock) {
      console.log("Using mock data for changePassword");
      
      // จำลองการตรวจสอบรหัสผ่านเดิม
      if (passwordData.currentPassword !== 'password') {
        return Promise.reject({
          response: {
            status: 400,
            data: { message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }
          }
        });
      }
      
      return Promise.resolve({
        data: { message: 'เปลี่ยนรหัสผ่านสำเร็จ' }
      });
    }
    return api.put('/user/password', passwordData);
  },
};

export const mapService = {
  searchPlaces: (keyword, params) => {
    if (useMock) {
      console.log(`Using mock data for searchPlaces: ${keyword}`);
      
      const filteredPlaces = MOCK_ATTRACTIONS.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase()) || 
        (p.name_en && p.name_en.toLowerCase().includes(keyword.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(keyword.toLowerCase())) ||
        p.province.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // กรองเพิ่มเติมตาม params
      if (params) {
        // เพิ่มตรรกะการกรองตาม params ตามต้องการ
      }
      
      return Promise.resolve({ data: filteredPlaces });
    }
    return api.get('/maps/places', { params: { keyword, ...params }});
  },
    
  getTouristPlacesByProvince: (province, category, limit) => {
    if (useMock) {
      console.log(`Using mock data for getTouristPlacesByProvince: ${province}, ${category}`);
      
      let filteredPlaces = [...MOCK_ATTRACTIONS];
      
      // กรองตามจังหวัด
      if (province) {
        filteredPlaces = filteredPlaces.filter(p => 
          p.province_id === province || 
          p.province === province ||
          MOCK_PROVINCES.find(prov => prov.id === parseInt(province))?.name === p.province
        );
      }
      
      // กรองตามหมวดหมู่
      if (category) {
        filteredPlaces = filteredPlaces.filter(p => 
          p.category_id === category || 
          p.category === category ||
          MOCK_CATEGORIES.find(cat => cat.id === parseInt(category))?.name === p.category
        );
      }
      
      // จำกัดจำนวน
      if (limit) {
        filteredPlaces = filteredPlaces.slice(0, parseInt(limit));
      }
      
      return Promise.resolve({ data: filteredPlaces });
    }
    return api.get('/maps/tourist-places', { params: { province, category, limit }});
  },
    
  getPlaceDetails: (id) => {
    if (useMock) {
      console.log(`Using mock data for getPlaceDetails: ${id}`);
      
      const place = MOCK_ATTRACTIONS.find(p => p.id === parseInt(id));
      if (!place) {
        return Promise.reject({
          response: {
            status: 404,
            data: { message: 'ไม่พบสถานที่' }
          }
        });
      }
      
      // เพิ่มข้อมูลเพิ่มเติมเช่น รีวิว, ภาพถ่ายเพิ่มเติม
      const enhancedPlace = {
        ...place,
        reviews: [
          { id: 1, user: 'ผู้ใช้ 1', rating: 4.5, comment: 'สถานที่สวยงาม', date: '2023-05-15' },
          { id: 2, user: 'ผู้ใช้ 2', rating: 5, comment: 'ประทับใจมาก', date: '2023-06-20' }
        ],
        additionalImages: [
          `https://source.unsplash.com/600x400/?thailand,${place.name}`,
          `https://source.unsplash.com/600x400/?tourism,${place.name}`
        ],
        openingHours: '08:00 - 18:00 น. (ทุกวัน)',
        entranceFee: 'ไม่มีค่าเข้าชม',
        facilities: ['ที่จอดรถ', 'ห้องน้ำ', 'ร้านอาหาร']
      };
      
      return Promise.resolve({ data: enhancedPlace });
    }
    return api.get(`/maps/place/${id}`);
  },
  
  getRoute: (origin, destination, mode) => {
    if (useMock) {
      console.log(`Using mock data for getRoute: ${origin} to ${destination}`);
      
      // จำลองข้อมูลเส้นทาง
      return Promise.resolve({
        data: {
          distance: { value: 12500, text: '12.5 กม.' },
          duration: { value: 1800, text: '30 นาที' },
          steps: [
            { 
              distance: { value: 500, text: '500 ม.' },
              duration: { value: 60, text: '1 นาที' },
              instruction: 'เริ่มต้นมุ่งหน้าไปทางทิศตะวันออก',
              mode: 'DRIVING'
            },
            { 
              distance: { value: 5000, text: '5 กม.' },
              duration: { value: 600, text: '10 นาที' },
              instruction: 'เลี้ยวขวาเข้าสู่ถนนหลัก',
              mode: 'DRIVING'
            },
            { 
              distance: { value: 7000, text: '7 กม.' },
              duration: { value: 1140, text: '19 นาที' },
              instruction: 'ขับตรงไปและถึงจุดหมาย',
              mode: 'DRIVING'
            }
          ]
        }
      });
    }
    return api.get('/maps/route', { params: { origin, destination, mode }});
  },
    
  generatePlan: (province, categories, days) => {
    if (useMock) {
      console.log(`Using mock data for generatePlan: ${province}, ${days} days`);
      
      // กรองสถานที่ตามจังหวัดและหมวดหมู่
      let filteredPlaces = [...MOCK_ATTRACTIONS];
      
      if (province) {
        filteredPlaces = filteredPlaces.filter(p => 
          p.province_id === province || 
          p.province === province ||
          MOCK_PROVINCES.find(prov => prov.id === parseInt(province))?.name === p.province
        );
      }
      
      if (categories && categories.length > 0) {
        const categoryList = categories.split(',');
        filteredPlaces = filteredPlaces.filter(p => 
          categoryList.some(cat => 
            p.category_id === parseInt(cat) || 
            p.category === cat ||
            MOCK_CATEGORIES.find(c => c.id === parseInt(cat))?.name === p.category
          )
        );
      }
      
      // จำลองการสร้างแผนท่องเที่ยว
      const daysInt = parseInt(days) || 1;
      const plan = {
        title: `แผนเที่ยว${MOCK_PROVINCES.find(p => p.id === parseInt(province))?.name || 'ท่องเที่ยว'} ${daysInt} วัน`,
        days: []
      };
      
      // สลับสถานที่เพื่อความหลากหลาย
      const shuffledPlaces = [...filteredPlaces].sort(() => 0.5 - Math.random());
      
      // จำนวนสถานที่ต่อวัน
      const placesPerDay = Math.min(3, Math.ceil(shuffledPlaces.length / daysInt));
      
      // สร้างแผนแต่ละวัน
      for (let i = 0; i < daysInt; i++) {
        const startIdx = i * placesPerDay;
        const endIdx = Math.min(startIdx + placesPerDay, shuffledPlaces.length);
        const dayPlaces = shuffledPlaces.slice(startIdx, endIdx);
        
        if (dayPlaces.length === 0) break;
        
        plan.days.push({
          day: i + 1,
          places: dayPlaces.map(p => ({
            id: p.id,
            name: p.name,
            image: p.image,
            description: p.description ? p.description.substring(0, 100) + '...' : null,
            category: p.category,
            visitDuration: Math.floor(Math.random() * 3) + 1 // 1-3 ชั่วโมง
          }))
        });
      }
      
      return Promise.resolve({ data: plan });
    }
    return api.get('/maps/generate-plan', { params: { province, categories, days }});
  }
};

export const districtService = {
  getDistrictsByProvince: (provinceId) => {
    if (useMock) {
      console.log(`Using mock data for getDistrictsByProvince: ${provinceId}`);
      
      // จำลองข้อมูลอำเภอ
      const districts = [
        { id: 1, name: 'อำเภอเมืองอำนาจเจริญ', province_id: 1 }, // อำนาจเจริญ (id 1)
        { id: 2, name: 'อำเภอบ้านนา', province_id: 1 },
        { id: 3, name: 'อำเภอเขาท่าแพง', province_id: 1 },
        
        { id: 4, name: 'อำเภอเมืองหนองบัวลำภู', province_id: 2 }, // หนองบัวลำภู (id 2)

        { id: 5, name: 'อำเภอเมืองอุบลราชธานี', province_id: 3 }, // อุบลราชธานี (id 3)
        { id: 6, name: 'อำเภอปทุมราชวงศา', province_id: 3 },
        
        { id: 7, name: 'อำเภอเมืองบุรีรัมย์', province_id: 4 }, // บุรีรัมย์ (id 4)
        
        { id: 8, name: 'อำเภอเมืองบึงกาฬ', province_id: 5 }, // บึงกาฬ (id 5)

        { id: 4401, name: 'เขตพระนคร', province_id: 44 }, // กรุงเทพมหานคร (id 44)
        { id: 4402, name: 'เขตดุสิต', province_id: 44 },
        { id: 4403, name: 'เขตหนองจอก', province_id: 44 },
        { id: 4404, name: 'เขตบางรัก', province_id: 44 },
        // เพิ่มอำเภอ/เขต อื่นๆ ตามต้องการ...
      ];
      
      // กรองอำเภอตามรหัสจังหวัด
      const filteredDistricts = districts.filter(d => d.province_id === parseInt(provinceId));
      
      return Promise.resolve({ data: filteredDistricts });
    }
    return api.get(`/districts?provinceId=${provinceId}`);
  },
};

export const subdistrictService = {
  getSubdistrictsByDistrict: (districtId) => {
    if (useMock) {
      console.log(`Using mock data for getSubdistrictsByDistrict: ${districtId}`);
      
      // จำลองข้อมูลตำบล
      const subdistricts = [
        { id: 101, name: 'ตำบลในเมือง', district_id: 1 }, // อ.เมืองอำนาจเจริญ (id 1)
        { id: 102, name: 'ตำบลบ้านเหนือ', district_id: 1 },
        
        { id: 401, name: 'ตำบลในเมืองหนองบัวลำภู', district_id: 4 }, // อ.เมืองหนองบัวลำภู (id 4)
        
        { id: 501, name: 'ตำบลในเมืองอุบลราชธานี', district_id: 5 }, // อ.เมืองอุบลราชธานี (id 5)
        { id: 502, name: 'ตำบลกุดลาด', district_id: 5 },

        { id: 440101, name: 'แขวงพระบรมมหาราชวัง', district_id: 4401 }, // เขตพระนคร (id 4401)
        { id: 440102, name: 'แขวงวัดสามพระยา', district_id: 4401 },
        { id: 440401, name: 'แขวงสีลม', district_id: 4404 }, // เขตบางรัก (id 4404)
        // เพิ่มตำบล/แขวง อื่นๆ ตามต้องการ...
      ];
      
      // กรองตำบลตามรหัสอำเภอ
      const filteredSubdistricts = subdistricts.filter(s => s.district_id === parseInt(districtId));
      
      return Promise.resolve({ data: filteredSubdistricts });
    }
    return api.get(`/subdistricts?districtId=${districtId}`);
  },
};

// สร้าง default export นี้เพื่อให้สอดคล้องกับการใช้ default import 
const defaultService = {
  placeService,
  planService,
  categoryService,
  provinceService,
  regionService,
  userService,
  mapService,
  districtService,
  subdistrictService,
  authService,
};

export default defaultService;