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

    // 🔥 NOTE: Theme logic removed from here. 
    // It is now fully handled by ThemeContext observing currentUser.

    const checkAuthStatus = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/is-auth`, { withCredentials: true });
            if (data.success) {
                setCurrentUser(data.userData);
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
                // ThemeContext will automatically pick up data.userData.theme
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
            // Theme reset logic is handled in ThemeContext or allowed to persist locally
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
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};