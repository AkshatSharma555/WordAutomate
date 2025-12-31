import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Ensure 'uploads' folder exists
// Agar server folder me 'uploads' folder nahi hai, toh yeh khud bana dega
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Storage Configuration (Disk Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // File ko 'uploads/' folder me save karega
    },
    filename: (req, file, cb) => {
        // Unique Name: timestamp-random-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. File Filter (Only allow .docx)
const fileFilter = (req, file, cb) => {
    // Sirf Word documents allow karenge
    if (
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        path.extname(file.originalname).toLowerCase() === '.docx'
    ) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only .docx files are allowed!"), false);
    }
};

// 4. Initialize Multer
const uploadDoc = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Max size 5MB limit
});

export default uploadDoc;