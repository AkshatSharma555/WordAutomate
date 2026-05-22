import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [isAdminLoggedin, setIsAdminLoggedin] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const getAdminAuthState = async () => {
    try {
      // Explicitly passing withCredentials here for safety
      const { data } = await axios.get(backendUrl + "/admin/is-auth", { withCredentials: true });
      if (data && data.success) {
        setIsAdminLoggedin(true);
        getAdminData();
      } else {
        setIsAdminLoggedin(false);
      }
    } catch (error) {
      // completely silenced
      setIsAdminLoggedin(false);
    }
  };

  const getAdminData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/admin/data", { withCredentials: true });
      if (data && data.success) {
        setAdminData(data.adminData);
      }
    } catch (error) {
      // completely silenced
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