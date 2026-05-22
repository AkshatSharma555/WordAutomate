import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, Edit, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const { backendUrl } = useContext(AdminContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', prn: '', branch: '', year: '' });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/admin/users');
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const confirmDeletePrompt = (id) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const { data } = await axios.delete(`${backendUrl}/admin/users/${userToDelete}`);
            if (data.success) {
                toast.success(data.message);
                setUsers(users.filter(user => user._id !== userToDelete));
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name || '',
            prn: user.prn || '',
            branch: user.branch || '',
            year: user.year || ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${backendUrl}/admin/users/${selectedUser._id}`, formData);
            if (data.success) {
                toast.success(data.message);
                setUsers(users.map(user => (user._id === selectedUser._id ? data.user : user)));
                setIsEditModalOpen(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] p-6 font-sans text-[#F3F2ED] relative">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/dashboard" className="p-2 bg-[#111] border border-[#222] rounded-xl hover:border-[#1AA3A3] hover:text-[#1AA3A3] transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-sm text-gray-500">Manage all registered students and their details.</p>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0A0A] border border-[#222] rounded-2xl overflow-hidden shadow-lg"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#111] border-b border-[#222] text-gray-400 text-sm">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email (GST)</th>
                                <th className="p-4 font-medium">PRN</th>
                                <th className="p-4 font-medium">Branch/Year</th>
                                <th className="p-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <Loader2 className="animate-spin text-[#1AA3A3] mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No users found in the database.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b border-[#222] hover:bg-[#111]/50 transition-colors">
                                        <td className="p-4 text-white font-medium">{user.name || "N/A"}</td>
                                        <td className="p-4 text-gray-300">{user.email}</td>
                                        <td className="p-4 text-[#F54A00] font-mono text-sm">{user.prn || "Not Set"}</td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {user.branch ? `${user.branch} / ${user.year}` : "Not Set"}
                                        </td>
                                        <td className="p-4 flex items-center justify-center gap-3">
                                            <button 
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-gray-400 hover:text-[#1AA3A3] hover:bg-[#1AA3A3]/10 rounded-lg transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => confirmDeletePrompt(user._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0A0A0A]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-xl">
                                        <Edit size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Edit Student Profile</h2>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white transition-colors bg-[#222] hover:bg-[#333] p-2 rounded-full">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1 uppercase tracking-wider">Full Name</label>
                                    <input 
                                        type="text" name="name" value={formData.name} onChange={handleEditChange} required
                                        className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1 uppercase tracking-wider">PRN Number</label>
                                    <input 
                                        type="text" name="prn" value={formData.prn} onChange={handleEditChange} required
                                        className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-[#F54A00] font-mono text-sm outline-none focus:border-[#F54A00] focus:ring-1 focus:ring-[#F54A00] transition-all" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-gray-400 font-medium ml-1 uppercase tracking-wider">Branch</label>
                                        <input 
                                            type="text" name="branch" value={formData.branch} onChange={handleEditChange} required
                                            className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-gray-400 font-medium ml-1 uppercase tracking-wider">Year</label>
                                        <input 
                                            type="text" name="year" value={formData.year} onChange={handleEditChange} required
                                            className="w-full bg-[#050505] border border-[#333] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <button 
                                        type="button" onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl border border-[#333] text-gray-300 hover:bg-[#222] transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl bg-[#1AA3A3] hover:bg-[#158585] text-white transition-all text-sm font-bold shadow-[0_0_20px_rgba(26,163,163,0.3)] hover:shadow-[0_0_25px_rgba(26,163,163,0.5)]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                                <AlertTriangle size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Delete Student?</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                This action cannot be undone. It will permanently remove the student's data from the database.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-[#333] text-gray-300 hover:bg-[#222] transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-bold shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;