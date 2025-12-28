import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Backend URL (Make sure yeh sahi ho)
const BACKEND_URL = 'http://localhost:5000/api/auth'; 

export const AuthProvider = ({ children }) => {
    const { instance } = useMsal();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🌟 CHECK AUTH STATUS (On Load)
    const checkAuthStatus = async () => {
        try {
            // Tumhara backend route jo check karta hai cookie valid hai ya nahi
            const { data } = await axios.get(`${BACKEND_URL}/is-auth`, { withCredentials: true });
            if (data.success) {
                // Agar verified hai, toh humein user details fetch karni chahiye (ek naya route bana sakte ho /me)
                // Abhi ke liye bas true set kar rahe hain
                setCurrentUser({ isAuthenticated: true }); 
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // 🌟 LOGIN FUNCTION
    const login = async () => {
        try {
            // 1. Microsoft Popup Open karo
            const loginResponse = await instance.loginPopup(loginRequest);
            const accessToken = loginResponse.accessToken;

            // 2. Token Backend ko bhejo
            const { data } = await axios.post(
                `${BACKEND_URL}/microsoft-login`, 
                { accessToken },
                { withCredentials: true } // Important for Cookies
            );

            if (data.success) {
                setCurrentUser(data.userData);
                return data.userData;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Login Failed:", error);
            throw error;
        }
    };

    // 🌟 LOGOUT FUNCTION
    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
            await instance.logoutPopup(); // Microsoft se bhi logout
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};