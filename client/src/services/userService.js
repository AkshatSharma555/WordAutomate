import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_URL = `${API_BASE_URL}/user`;

export const userService = {
  // Profile data fetch karne ke liye
  getUserData: async () => {
    const { data } = await axios.get(`${USER_URL}/data`, { withCredentials: true });
    return data;
  },
  
  // Personal info update karne ke liye
  updatePersonalInfo: async (userData) => {
    const { data } = await axios.post(`${USER_URL}/update-personal-info`, userData, { withCredentials: true });
    return data;
  }
};