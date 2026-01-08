import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    // 1. Initial Load: Default to LocalStorage or Dark
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'dark';
    });

    // 2. Track Last Synced DB Theme to prevent loops
    const lastSyncedTheme = useRef(theme);

    useEffect(() => {
        if (currentUser) {
            // --- SAFETY CHECK START ---
            // Sirf tabhi Force Dark karo jab user explicitly UNVERIFIED ho (New Account).
            // Agar field missing hai ya true hai, toh mat chedo.
            if (currentUser.isAccountVerified === false) {
                if (theme !== 'dark') setTheme('dark');
                return; // Stop execution here
            } 
            // --- SAFETY CHECK END ---

            // Smart Sync Logic
            const serverTheme = currentUser.theme;
            
            // Agar DB mein valid theme hai, aur wo pichli baar se alag hai
            if (serverTheme && serverTheme !== lastSyncedTheme.current) {
                // Toh UI update karo
                setTheme(serverTheme);
                // Aur Ref update karo
                lastSyncedTheme.current = serverTheme;
            }
        } 
    }, [currentUser]); 

    // 3. Apply Class & Save to LocalStorage (Standard Logic)
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('appTheme', theme);
        
        // Update Ref to match current state (Helps in manual toggles)
        if (currentUser && currentUser.theme === theme) {
             lastSyncedTheme.current = theme;
        }
    }, [theme, currentUser]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setThemeManual = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeManual }}>
            {children}
        </ThemeContext.Provider>
    );
};