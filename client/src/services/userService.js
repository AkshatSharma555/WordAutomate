import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_URL = `${API_BASE_URL}/user`;

// 1. Get User Data
export const getUserData = async () => {
    try {
        const { data } = await axios.get(`${USER_URL}/data`, { withCredentials: true });
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// 2. Update Personal Info (Named Export)
export const updatePersonalInfo = async (userData) => {
    try {
        // Backend route ke hisab se PUT ya POST use karo. Standard update ke liye PUT behtar hai.
        const { data } = await axios.put(`${USER_URL}/update-personal-info`, userData, { withCredentials: true });
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Default Object Export (Optional, for compatibility)
export const userService = {
    getUserData,
    updatePersonalInfo
};