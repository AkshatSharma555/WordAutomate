import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import { Users, SearchSlash, Network } from 'lucide-react';

// Import our new components
import FriendsTabs from '../components/friends/FriendsTabs';
import RequestCard from '../components/friends/RequestCard';
import ConnectionCard from '../components/friends/ConnectionCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Friends = () => {
  const { currentUser, logout } = useAuth();
  
  // ⚡ FIX: Default Tab is now 'connections' (My Network)
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
    // Note: Confirmation logic is now inside ConnectionCard UI, this is the raw API call
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
    <div className="min-h-screen bg-[#F3F2ED] dark:bg-[#050505]">
      <DashboardNavbar user={currentUser} onLogout={logout} />
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      {/* ⚡ UPDATED: Max Width 7xl for efficient space usage */}
      <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
        
        {/* ================= HEADER SECTION (Flex Layout) ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
           
           {/* LEFT: Text Info */}
           <div className="flex-1">
              <div className="mb-2">
                 <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Network', path: '/friends' }]} />
              </div>
              <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                   Your Network
                 </h1>
                 <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {friends.length} Connections
                 </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-lg">
                Manage your academic connections. Accept lab partners or clean up your list.
              </p>
           </div>

           {/* RIGHT: Tabs (Auto width) */}
           <div>
              <FriendsTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                counts={{ requests: requests.length, connections: friends.length }}
              />
           </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="min-h-[400px]">
          
          {/* --- TAB: MY NETWORK (Default) --- */}
          {activeTab === 'connections' && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
             >
               {friends.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-[#111111]/50">
                    <div className="size-20 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <Network size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your network is empty</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 mb-6">
                       Connect with your batchmates and seniors to start building your academic circle.
                    </p>
                    <a href="/explore" className="px-6 py-2.5 rounded-xl bg-[#1AA3A3] text-white font-bold text-sm hover:bg-[#158585] transition-colors shadow-lg shadow-[#1AA3A3]/20">
                       Go to Explore
                    </a>
                 </div>
               ) : (
                 // ⚡ UPDATED: Responsive Grid (Upto 4 columns on large screens)
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            <AnimatePresence mode="popLayout">
               {requests.length === 0 ? (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="flex flex-col items-center justify-center py-20 text-center"
                 >
                    <div className="size-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                        <Users size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No pending requests at the moment.</p>
                 </motion.div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {requests.map((req) => (
                      <RequestCard 
                        key={req._id} 
                        request={req} 
                        onAction={handleRequestAction} 
                        loading={loading}
                      />
                    ))}
                 </div>
               )}
            </AnimatePresence>
          )}

        </div>
      </div>
    </div>
  );
};

export default Friends;