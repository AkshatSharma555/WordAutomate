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
    microsoftId: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: { 
        type: String, 
        default: "" 
    },
    microsoftOriginalUrl: { 
        type: String, 
        default: "" },
    
    theme: { type: String, default: 'light', enum: ['light', 'dark'] }
}, { timestamps: true }); 


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;