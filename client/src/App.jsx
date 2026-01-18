import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing Pages (Student App)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Generate from './pages/Generate';
import Workspace from './pages/Workspace';
import Explore from './pages/Explore';
import Friends from './pages/Friends';

// Admin Pages Import (Isolated)
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVerify from './pages/admin/AdminVerify'; 
import AdminReset from './pages/admin/AdminReset';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; 
// 👇 NEW: Import Admin Context Provider
import { AdminContextProvider } from './context/AdminContext'; 

// Route Tracker
import RouteTracker from './components/common/RouteTracker';

const App = () => {
  return (
    <AuthProvider>
      {/* 👇 NEW: Wrap Admin Provider Here */}
      <AdminContextProvider>
        <ThemeProvider>
          <Router>
             {/* Tracker Component */}
             <RouteTracker />

            <Routes>
              {/* =========================================
                  🎓 STUDENT / PUBLIC APPLICATION ROUTES
                 ========================================= */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/generate" element={<Generate />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/friends" element={<Friends />} />

              {/* =========================================
                  🛡️ ADMIN PANEL ROUTES (Isolated)
                 ========================================= */}
              
              <Route path="/admin-secret-access" element={<AdminLogin />} />
              <Route path="/admin/verify" element={<AdminVerify />} />
              <Route path="/admin/reset-password" element={<AdminReset />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

            </Routes>
          </Router>
        </ThemeProvider>
      </AdminContextProvider> {/* 👈 Close Admin Provider */}
    </AuthProvider>
  );
};

export default App;