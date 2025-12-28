import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        // required: true  <-- HATAYA: Kyunki Microsoft users ka password nahi hoga
    },
    microsoftId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values (agar normal user hai toh ye null hoga)
    },
    authProvider: {
        type: String,
        enum: ['email', 'microsoft'], // Sirf ye do values allow hongi
        default: 'email'
    },
    isAccountVerified: { 
        type: Boolean, 
        default: false 
    },
    // --- Legacy Fields (OTP wagera abhi rakhte hain safe side ke liye) ---
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
}, { timestamps: true }); // Automatic createdAt aur updatedAt banayega

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;