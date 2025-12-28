import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 👈 'Router' import kiya
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      {/* 👇 YEH WRAPPER MISSING THA */}
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      {/* 👆 WRAPPER CLOSED */}
    </AuthProvider>
  );
};

export default App;