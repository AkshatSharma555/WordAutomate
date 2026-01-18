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
    getAdminData 
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
router.get('/is-auth', adminAuth, isAuthenticated); // Used by AdminContext to check session
router.get('/data', adminAuth, getAdminData);       // Used by AdminContext to get profile

export default router;