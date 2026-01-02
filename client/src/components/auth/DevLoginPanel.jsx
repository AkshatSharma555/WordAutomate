import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bug, Loader2, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const dummyUsers = [
  { name: "Virat Kohli", email: "virat.kohli@sies.edu.in", role: "TE - IT" },
  { name: "Rohit Sharma", email: "rohit.sharma@sies.edu.in", role: "BE - ECS" },
  { name: "Hardik Pandya", email: "hardik.pandya@sies.edu.in", role: "TE - EXTC" },
  { name: "Jasprit Bumrah", email: "jasprit.bumrah@sies.edu.in", role: "SE - ME" },
  { name: "KL Rahul", email: "kl.rahul@sies.edu.in", role: "BE - CE" },

  { name: "Shubman Gill", email: "shubman.gill@sies.edu.in", role: "FE - AIML" },
  { name: "Suryakumar Yadav", email: "suryakumar.yadav@sies.edu.in", role: "SE - IT" },
  { name: "Ravindra Jadeja", email: "ravindra.jadeja@sies.edu.in", role: "TE - IOT" },
  { name: "Mohammed Shami", email: "mohammed.shami@sies.edu.in", role: "BE - EXTC" },
  { name: "Rishabh Pant", email: "rishabh.pant@sies.edu.in", role: "SE - ECS" },
  { name: "Kuldeep Yadav", email: "kuldeep.yadav@sies.edu.in", role: "TE - AIDS" },
  { name: "Shreyas Iyer", email: "shreyas.iyer@sies.edu.in", role: "FE - CE" },
  { name: "Axar Patel", email: "axar.patel@sies.edu.in", role: "BE - ME" },
  { name: "Yuzvendra Chahal", email: "yuzvendra.chahal@sies.edu.in", role: "TE - IT" },
  { name: "Bhuvneshwar Kumar", email: "bhuvneshwar.kumar@sies.edu.in", role: "SE - EXTC" }
];

const DevLoginPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleDevLogin = async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/auth/dev-login`,
        { email },
        { withCredentials: true }
      );

      if (data.success) {
        navigate('/dashboard');
        window.location.reload();
      } else {
        alert("Dev Login Failed: " + data.message);
      }
    } catch (error) {
      alert("Server Error. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center border border-slate-700"
      >
        <Bug size={20} className={isOpen ? "text-red-400" : "text-green-400"} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4">

          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Developer Access
            </h3>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
              Test Mode
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto pr-1 custom-scroll">

            {dummyUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleDevLogin(user.email)}
                disabled={loading}
                className="w-full p-2 rounded-lg hover:bg-slate-800 transition flex items-center gap-3 mb-1"
              >
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center">
                  <User size={15} className="text-slate-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {user.role}
                  </p>
                </div>

                {loading && (
                  <Loader2
                    size={14}
                    className="ml-auto animate-spin text-slate-500"
                  />
                )}
              </button>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default DevLoginPanel;
