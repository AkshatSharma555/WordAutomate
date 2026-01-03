import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = `${API_BASE_URL}/auth`;

export const AuthProvider = ({ children }) => {
    const { instance } = useMsal();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 HELPER: Apply theme globally
    const applyTheme = (themePreference) => {
        const root = window.document.documentElement;
        // Remove both to be safe, then add the correct one
        root.classList.remove('light', 'dark'); 
        
        if (themePreference === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.add('light'); // Optional, but good for consistency
        }
        // Save to local storage as fallback
        localStorage.setItem('theme', themePreference);
    };

    const checkAuthStatus = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/is-auth`, { withCredentials: true });
            if (data.success) {
                setCurrentUser(data.userData);
                // ⚡ Apply theme immediately on load
                if (data.userData.theme) {
                    applyTheme(data.userData.theme);
                }
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
                // ⚡ Apply theme immediately on login
                if (data.userData.theme) {
                    applyTheme(data.userData.theme);
                }
                return data.userData;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
            await instance.logoutPopup();
            setCurrentUser(null);
            // Optional: Reset theme on logout if desired, or keep user preference
            localStorage.removeItem('theme');
            document.documentElement.classList.remove('dark');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            setCurrentUser,
            login, 
            logout, 
            loading,
            applyTheme // Exporting this if other components need to force update
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};