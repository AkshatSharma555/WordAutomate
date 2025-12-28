import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
// Login page hum baad mein banayenge, abhi ke liye Landing hi set karte hain

const App = () => {
  return (
    <Routes>
      {/* Default Path: Home Page */}
      <Route path="/" element={<Landing />} />
      
      {/* Future Routes (Example) */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
};

export default App;