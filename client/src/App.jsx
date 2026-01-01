import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// 👇 NEW PAGES IMPORT
import Generate from './pages/Generate';
import Workspace from './pages/Workspace';
import Explore from './pages/Explore';
import Friends from './pages/Friends';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; 

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public & Auth Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Main App Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />

            {/* 👇 Feature Routes */}
            <Route path="/generate" element={<Generate />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;