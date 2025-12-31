import axios from 'axios';

// Development aur Production URL handle karne ke liye
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const docService = {
  /**
   * Word Document Generate karne ka function
   * @param {FormData} formData - Isme file aur studentData hoga
   * @returns {Promise} - Backend response (PDF URL)
   */
  generateDocument: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/document/generate`, formData, {
        // ⚠️ CRITICAL: Yeh true hona chahiye kyunki hum Auth ke liye Cookies use kar rahe hain
        withCredentials: true, 
        headers: {
          'Content-Type': 'multipart/form-data', // File upload ke liye zaroori header
        },
      });
      return response.data;
    } catch (error) {
      // Production Grade Error Handling:
      // Backend se jo error message aayega (e.g., "Token Expired"), hum wahi throw karenge
      const errorMessage = error.response?.data?.message || "Something went wrong during generation";
      throw errorMessage;
    }
  }
};