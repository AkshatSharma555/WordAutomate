import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Lenis from 'lenis'; 
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import Breadcrumb from '../components/common/Breadcrumb';
import { motion } from 'framer-motion';

// Components
import ExploreSidebar from '../components/explore/ExploreSidebar';
import SearchHeader from '../components/explore/SearchHeader';
import StudentGrid from '../components/explore/StudentGrid';
import StudentProfileModal from '../components/explore/StudentProfileModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Explore = () => {
  const { currentUser, logout } = useAuth();
  
  // Refs
  const scrollContainerRef = useRef(null); 

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: '', branch: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Mobile Filter Helpers
  const years = ["FE", "SE", "TE", "BE"];
  const branches = ["ECS", "EXTC", "IT", "AIDS", "AIML", "IOT", "CE", "ME"];

  // 1. LENIS SMOOTH SCROLL
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current.firstChild,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); };
  }, [loading, students]); 

  // 2. SEARCH DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchTerm); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. FETCH DATA
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.branch) params.append('branch', filters.branch);
        if (filters.year) params.append('year', filters.year);
        if (debouncedSearch) params.append('search', debouncedSearch);

        const { data } = await axios.get(`${API_URL}/user/explore?${params.toString()}`, {
          withCredentials: true
        });

        if (data.success) {
          const discoverableUsers = data.users.filter(u => u.friendStatus !== 'accepted' && u.friendStatus !== 'friends');
          setStudents(discoverableUsers);
        }
      } catch (error) {
        console.error("Explore Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [filters, debouncedSearch]); 

  const toggleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  return (
    <div className="h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] flex flex-col overflow-hidden transition-colors duration-300 font-sans">
      
      {/* Navbar Fixed Top */}
      <DashboardNavbar user={currentUser} onLogout={logout} />
      
      {/* --- AMBIENT BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#F54A00] opacity-10 dark:opacity-[0.05] animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#1AA3A3] opacity-10 dark:opacity-[0.05] animate-pulse" style={{animationDuration: '10s'}} />
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      {selectedStudent && <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}

      {/* FIX: Changed 'pt-20' to 'pt-[60px]' or 'pt-16'. 
          This aligns the content exactly below the navbar height (~60-64px) removing the gap.
      */}
      <div className="flex flex-1 overflow-hidden pt-[60px] max-w-[100%] mx-auto w-full relative z-10">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-72 h-full border-r border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-[#111]/40 backdrop-blur-md p-0 z-20">
           {/* Sidebar Wrapper with internal padding if needed */}
           <div className="h-full p-6">
             <ExploreSidebar 
               filters={filters} 
               setFilters={setFilters} 
               onClear={() => setFilters({ year: '', branch: '' })} 
             />
           </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative">
            
            {/* FIXED HEADER SECTION */}
            <div className="shrink-0 z-30 bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5">
              <div className="px-4 md:px-8 pt-6 pb-2">
                  <div className="mb-2">
                    <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Explore', path: '/explore' }]} />
                  </div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black text-slate-900 dark:text-white tracking-tight"
                  >
                    Explore Community
                  </motion.h1>
              </div>

              <div className="px-4 md:px-8 pb-6">
                  <SearchHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                  {/* Mobile Filters Row */}
                  <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {years.map(y => (
                          <button key={y} onClick={() => toggleFilter('year', y)} 
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filters.year === y ? 'bg-[#1AA3A3] text-white border-[#1AA3A3] shadow-md shadow-[#1AA3A3]/20' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}>
                            {y}
                          </button>
                      ))}
                      <div className="w-px bg-slate-300 dark:bg-white/10 mx-1 h-6 self-center"></div>
                      {branches.map(b => (
                          <button key={b} onClick={() => toggleFilter('branch', b)} 
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${filters.branch === b ? 'bg-[#F54A00] text-white border-[#F54A00] shadow-md shadow-[#F54A00]/20' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}>
                            {b}
                          </button>
                      ))}
                  </div>
              </div>
            </div>

            {/* SCROLLABLE CARD AREA */}
            <div 
              ref={scrollContainerRef} 
              className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-32"
            >
              <div>
                {/* Result Count Badge */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Showing {students.length} Students
                    </h2>
                    
                    {(filters.year || filters.branch) && (
                        <div className="hidden md:flex items-center gap-2">
                            {filters.year && <span className="text-[10px] font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-2 py-1 rounded-md border border-[#1AA3A3]/20">Year: {filters.year}</span>}
                            {filters.branch && <span className="text-[10px] font-bold text-[#F54A00] bg-[#F54A00]/10 px-2 py-1 rounded-md border border-[#F54A00]/20">Branch: {filters.branch}</span>}
                        </div>
                    )}
                </div>

                <StudentGrid 
                  loading={loading}
                  students={students}
                  setToast={setToast}
                  onViewProfile={setSelectedStudent}
                />
              </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;