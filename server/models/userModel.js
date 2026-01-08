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
    prn: { type: String, default: "" },
    branch: { type: String, default: "" }, 
    year: { type: String, default: "" },
    
    microsoftId: {
        type: String,
        required: true,
        unique: true
    },
    
    // Yahan ab Base64 String store hogi (Long string)
    profilePicture: { 
        type: String, 
        default: "" 
    },
    
    // Backup field
    microsoftOriginalUrl: { 
        type: String, 
        default: "" 
    },

    microsoftAccessToken: { 
        type: String, 
        select: false 
    },
    
    theme: { type: String, default: 'dark', enum: ['light', 'dark'] }
}, { timestamps: true }); 

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;