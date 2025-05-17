import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function to handle jsonData format conversion

const planService = {
  // Get all plans for user
  getUserPlans: async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response;
    } catch (error) {
      console.error('API Error for /plans:', error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Get public plans
  getPublicPlans: async (sort) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/plans/public${sort ? `?sort=${sort}` : ''}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      return response;
    } catch (error) {
      console.error(`API Error for /plans/public:`, error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Get plan by id
  getPlanById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response;
    } catch (error) {
      console.error(`API Error for /plans/${id}:`, error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Create a new plan
  createPlan: async (planData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Format data properly for the API
      const formattedData = {
        title: planData.title,
        coverImage: planData.coverImage || null,
        note: planData.note || "",
        // Important: Ensure jsonData is handled correctly
        jsonData: planData.jsonData  // Let axios handle serialization
      };
      
      console.log("planService sending data:", formattedData);
      
      const response = await axios.post(`${API_URL}/plans`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Add request transformer to handle jsonData format
        transformRequest: [(data) => {
          // If jsonData is an object but not a string, stringify it
          if (data.jsonData && typeof data.jsonData === 'object') {
            // Create a clean copy to avoid modifying the original
            const transformedData = { ...data };
            
            // Only stringify if it's not already a string
            if (typeof transformedData.jsonData !== 'string') {
              transformedData.jsonData = JSON.stringify(transformedData.jsonData);
            }
            
            return JSON.stringify(transformedData);
          }
          
          // Let axios handle it normally
          return JSON.stringify(data);
        }]
      });
      
      return response;
    } catch (error) {
      console.error('API Error for creating plan:', error.response?.status, error.response?.data);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error;
    }
  },

  // Update an existing plan
  updatePlan: async (id, planData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Format data properly for the API
      const formattedData = {
        title: planData.title,
        coverImage: planData.coverImage || null,
        note: planData.note || "",
        // Important: Ensure jsonData is handled correctly
        jsonData: planData.jsonData
      };
      
      const response = await axios.put(`${API_URL}/plans/${id}`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Add request transformer to handle jsonData format
        transformRequest: [(data) => {
          // If jsonData is an object but not a string, stringify it
          if (data.jsonData && typeof data.jsonData === 'object') {
            // Create a clean copy to avoid modifying the original
            const transformedData = { ...data };
            
            // Only stringify if it's not already a string
            if (typeof transformedData.jsonData !== 'string') {
              transformedData.jsonData = JSON.stringify(transformedData.jsonData);
            }
            
            return JSON.stringify(transformedData);
          }
          
          // Let axios handle it normally
          return JSON.stringify(data);
        }]
      });
      
      return response;
    } catch (error) {
      console.error(`API Error for updating plan ${id}:`, error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Delete a plan
  deletePlan: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`${API_URL}/plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response;
    } catch (error) {
      console.error(`API Error for deleting plan ${id}:`, error.response?.status, error.response?.data);
      throw error;
    }
  }
};

export default planService;