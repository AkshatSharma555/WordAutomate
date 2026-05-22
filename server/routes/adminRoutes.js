import express from 'express';
import { 
    registerAdmin, 
    loginAdmin, 
    logoutAdmin, 
    sendVerifyOtp, 
    verifyEmail, 
    isAuthenticated, 
    sendResetOtp, 
    resetPassword,
    getAdminData ,
    getAllUsers ,
    updateUser,
    deleteUser,
    getDashboardStats
} from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public Routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutAdmin); // Logout usually doesn't strictly need auth check if using cookies, but clearCookie works regardless.

// Protected Routes (Require Login)
router.post('/send-verify-otp', adminAuth, sendVerifyOtp);
router.post('/verify-account', adminAuth, verifyEmail);
router.get('/is-auth', adminAuth, isAuthenticated); 
router.get('/data', adminAuth, getAdminData); 
router.get('/users', adminAuth, getAllUsers);     
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);
router.get('/dashboard-stats', adminAuth, getDashboardStats);

export default router;