import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import { Users, Network, ArrowRight, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Link } from 'react-router-dom';

// Import Components
import FriendsTabs from '../components/friends/FriendsTabs';
import RequestCard from '../components/friends/RequestCard';
import ConnectionCard from '../components/friends/ConnectionCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Friends = () => {
  const { currentUser, logout } = useAuth();
  
  // Default Tab: My Network
  const [activeTab, setActiveTab] = useState('connections');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const reqRes = await axios.get(`${API_URL}/user/friends/pending`, { withCredentials: true });
      if (reqRes.data.success) setRequests(reqRes.data.requests);

      const friendRes = await axios.get(`${API_URL}/user/friends`, { withCredentials: true });
      if (friendRes.data.success) setFriends(friendRes.data.friends);

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/user/friend-request/respond`,
        { requestId, action }, 
        { withCredentials: true }
      );

      if (data.success) {
        setToast({ show: true, message: `Request ${action}ed`, type: 'success' });
        setRequests(prev => prev.filter(r => r._id !== requestId));
        if (action === 'accept') fetchData(); 
      }
    } catch (error) {
      setToast({ show: true, message: "Action failed", type: 'error' });
    }
  };

  const handleUnfriend = async (targetUserId) => {
    try {
        const { data } = await axios.post(
            `${API_URL}/user/friend-request/remove`,
            { targetUserId },
            { withCredentials: true }
        );
        if(data.success) {
            setToast({ show: true, message: "Connection removed", type: 'info' });
            setFriends(prev => prev.filter(f => f._id !== targetUserId));
        }
    } catch (error) {
        setToast({ show: true, message: "Failed to remove", type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2ED] dark:bg-[#050505] transition-colors duration-300 font-sans">
      
      <DashboardNavbar user={currentUser} onLogout={logout} />
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#F54A00] opacity-10 dark:opacity-[0.05] animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#1AA3A3] opacity-10 dark:opacity-[0.05] animate-pulse" style={{animationDuration: '10s'}} />
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200/60 dark:border-white/5">
            
            {/* Left: Title & Info */}
            <div className="flex-1">
              
              {/* Back Link (Breadcrumb Replacement) */}
              <div className="mb-2">
                 <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1AA3A3] dark:text-slate-400 dark:hover:text-[#1AA3A3] transition-colors group">
                    <div className="p-1 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-[#1AA3A3]/20 transition-colors">
                      <ArrowLeft size={12} />
                    </div> 
                    Back to Dashboard
                 </Link>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                   Your Network
                 </h1>
                 <span className="hidden sm:inline-flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                    {friends.length} Connections
                 </span>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-lg leading-relaxed">
                Manage your academic connections. Build your circle to easily share and receive documents.
              </p>
            </div>

            {/* Right: Tabs */}
            <div className="w-full lg:w-auto">
              <FriendsTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                counts={{ requests: requests.length, connections: friends.length }}
              />
            </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="min-h-[400px]">
          
          {/* --- TAB: MY NETWORK --- */}
          {activeTab === 'connections' && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
             >
               {friends.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[32px] bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="size-20 bg-white dark:bg-[#151515] rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-white/5">
                        <Network size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Your network is empty</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                        Start connecting with your batchmates and seniors to build your academic circle.
                    </p>
                    <Link to="/explore" className="px-8 py-3 rounded-2xl bg-[#1AA3A3] text-white font-bold text-sm hover:bg-[#158585] transition-all shadow-lg shadow-[#1AA3A3]/20 flex items-center gap-2">
                        Find Peers <ArrowRight size={16} />
                    </Link>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {friends.map((friend) => (
                      <ConnectionCard 
                        key={friend._id} 
                        friend={friend} 
                        onUnfriend={handleUnfriend}
                      />
                    ))}
                 </div>
               )}
             </motion.div>
          )}

          {/* --- TAB: REQUESTS --- */}
          {activeTab === 'requests' && (
            <AnimatePresence mode="wait">
               {requests.length === 0 ? (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }}
                   className="flex flex-col items-center justify-center py-32 text-center"
                 >
                    <div className="size-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100 dark:ring-white/10">
                        <Users size={24} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No pending requests at the moment.</p>
                 </motion.div>
               ) : (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                 >
                    {requests.map((req) => (
                      <RequestCard 
                        key={req._id} 
                        request={req} 
                        onAction={handleRequestAction} 
                        loading={loading}
                      />
                    ))}
                 </motion.div>
               )}
            </AnimatePresence>
          )}

        </div>
      </div>
    </div>
  );
};

export default Friends;