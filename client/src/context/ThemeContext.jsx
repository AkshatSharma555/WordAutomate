import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    // Initial Load: LocalStorage > DB > Light
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'light');

    // 1. Sync with DB on Login (Initial only)
    useEffect(() => {
        if (currentUser && currentUser.theme) {
            setTheme(currentUser.theme);
        }
    }, [currentUser]);

    // 2. Apply Class to HTML & Save to LocalStorage
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('appTheme', theme);
    }, [theme]);

    // 3. Toggle Function (Sirf State Change, No API)
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Helper to manually set theme (used for Discard changes)
    const setThemeManual = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeManual }}>
            {children}
        </ThemeContext.Provider>
    );
};