import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  // .env se URL aa raha hai: "http://localhost:5000/api"
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [isAdminLoggedin, setIsAdminLoggedin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // 🔥 1. Check Auth Status
  const getAdminAuthState = async () => {
    try {
      // FIX: '/api' hata diya kyunki backendUrl mein already hai
      // Result: http://localhost:5000/api/admin/is-auth
      const { data } = await axios.get(backendUrl + "/admin/is-auth");
      if (data.success) {
        setIsAdminLoggedin(true);
        getAdminData();
      }
    } catch (error) {
      console.error("Admin Auth Check Error:", error);
    }
  };

  // 🔥 2. Fetch Admin Data
  const getAdminData = async () => {
    try {
      // FIX: '/api' hata diya
      const { data } = await axios.get(backendUrl + "/admin/data");
      if (data.success) {
        setAdminData(data.adminData);
      } else {
        console.error("Failed to fetch admin data:", data.message);
      }
    } catch (error) {
      console.error("Admin Data Fetch Error:", error);
    }
  };

  useEffect(() => {
    getAdminAuthState();
  }, []);

  const value = {
    backendUrl,
    isAdminLoggedin,
    setIsAdminLoggedin,
    adminData,
    setAdminData,
    getAdminData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};