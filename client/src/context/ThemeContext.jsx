import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    // 1. Initial Load: Check LocalStorage (Key: 'appTheme') -> Default 'light'
    // Hum lazy initialization use kar rahe hain taaki render block na ho
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'light';
    });

    // 2. Sync with Database when User Logs In
    // Jaise hi currentUser change hoga (Login pe), ye chalega aur state update karega.
    useEffect(() => {
        if (currentUser && currentUser.theme) {
            // Agar DB theme aur current theme alag hain, tabhi update karo
            if (currentUser.theme !== theme) {
                setTheme(currentUser.theme);
            }
        }
    }, [currentUser]);

    // 3. Apply Class to HTML & Save to LocalStorage (The Main Effect)
    // Jab bhi 'theme' state change hoga, ye DOM update karega.
    useEffect(() => {
        const root = window.document.documentElement;
        
        // Clean cleanup
        root.classList.remove('light', 'dark');
        
        // Add new class
        root.classList.add(theme);
        
        // Save to LocalStorage with CONSISTENT key
        localStorage.setItem('appTheme', theme);
        
    }, [theme]);

    // 4. Toggle Function
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Helper to manually set theme (used for Discard changes in Settings)
    const setThemeManual = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeManual }}>
            {children}
        </ThemeContext.Provider>
    );
};