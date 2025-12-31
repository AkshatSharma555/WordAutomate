import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    // Kis user ne generate kiya (Teacher/Student)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Original Word file ka naam (e.g., "Experiment1.docx")
    originalName: {
        type: String,
        required: true
    },
    // Generate hone ke baad PDF ka naam (e.g., "DBMS_Rahul_123.pdf")
    generatedName: {
        type: String,
        required: true
    },
    // Cloudinary URL jahan PDF save hai (Sharing ke liye)
    pdfUrl: {
        type: String,
        required: true
    },
    // Kis student ke liye bana hai
    studentName: {
        type: String,
        default: "Unknown"
    },
    studentPrn: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const documentModel = mongoose.models.document || mongoose.model('document', documentSchema);

export default documentModel;