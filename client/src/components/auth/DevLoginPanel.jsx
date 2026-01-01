import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Apni path check karlena
import { Bug, Loader2, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const dummyUsers = [
  { name: "Virat Kohli", email: "virat.kohli@sies.edu.in", role: "TE - IT" },
  { name: "Rohit Sharma", email: "rohit.sharma@sies.edu.in", role: "BE - ECS" },
  { name: "Hardik Pandya", email: "hardik.pandya@sies.edu.in", role: "TE - EXTC" },
  { name: "Jasprit Bumrah", email: "jasprit.bumrah@sies.edu.in", role: "SE - ME" },
  { name: "KL Rahul", email: "kl.rahul@sies.edu.in", role: "BE - CE" }
];

const DevLoginPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Toggle to hide/show panel
  const { setCurrentUser } = useAuth(); // Context update karne ke liye
  const navigate = useNavigate();

  const handleDevLogin = async (email) => {
    setLoading(true);
    try {
      // Direct Backdoor Login
      const { data } = await axios.post(
        `${API_URL}/auth/dev-login`, 
        { email }, 
        { withCredentials: true }
      );

      if (data.success) {
        // 1. Context Update (Important: User ko logged in feel karana)
        // Hum manually fetch nahi kar rahe, bas redirect kar rahe hain
        // Dashboard load hote hi wo /me call karke asli data le aayega.
        navigate('/dashboard');
        window.location.reload(); // Reload zaroori hai taaki AuthContext cookie read karle
      } else {
        alert("Dev Login Failed: " + data.message);
      }
    } catch (error) {
      console.error("Dev Login Error", error);
      alert("Server Error. Backend chal raha hai na?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center gap-2 border border-slate-700"
        title="Open Developer Login"
      >
        <Bug size={20} className={isOpen ? "text-red-400" : "text-green-400"} />
      </button>

      {/* The Panel */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dev Access</h3>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">TEST MODE</span>
          </div>

          <div className="space-y-2">
            {dummyUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleDevLogin(user.email)}
                disabled={loading}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-3 group"
              >
                <div className="size-8 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center text-slate-400">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.role}</p>
                </div>
                {loading && <Loader2 size={14} className="ml-auto animate-spin text-slate-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevLoginPanel;