import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import axios from 'axios';

const AuthContext = createContext();

// Custom Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

// Backend Base URL
const BACKEND_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
    const { instance } = useMsal();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🌟 1. Check Auth Status (On Page Load/Refresh)
    const checkAuthStatus = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/is-auth`, { withCredentials: true });
            if (data.success) {
                setCurrentUser(data.userData);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error("Auth Check Error:", error.message);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // 🌟 2. Login Function
    const login = async () => {
        try {
            const loginResponse = await instance.loginPopup(loginRequest);
            const accessToken = loginResponse.accessToken;

            const { data } = await axios.post(
                `${BACKEND_URL}/microsoft-login`,
                { accessToken },
                { withCredentials: true }
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

    // 🌟 3. Logout Function
    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
            await instance.logoutPopup();
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            setCurrentUser, // 👈 YEH ADD KIYA HAI (CRITICAL FIX)
            login, 
            logout, 
            loading 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};