import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";           // New: Security ke liye
import compression from "compression"; // New: Speed ke liye

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import docRouter from "./routes/docRoutes.js";
import workspaceRouter from "./routes/workspaceRoutes.js";

const app = express();
const port = process.env.PORT || 5000; 

// Database Connection
connectDB();

// 👇 UPDATED: Best Practices Middleware (Security & Speed)
app.use(helmet());      // Hackers se protect karega
app.use(compression()); // Responses ko fast banayega

// 👇 Allowed Origins List
const allowedOrigins = [
    "http://localhost:5173",
    "https://word-automate.vercel.app",   // Tera Live Frontend
    "https://word-automate.vercel.app/" 
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: function (origin, callback) {
        // Mobile apps ya Postman ke liye no origin allow karte hain
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            // Agar origin allowed list me nahi hai
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// API Endpoints
// 👇 Naya Message taaki pata chale update ho gaya
app.get("/", (req, res) => res.send("API Working Fast & Secure via CI/CD Pipeline!"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/document", docRouter);
app.use("/api/workspace", workspaceRouter);

// Server Start
app.listen(port, () => console.log(`Server started on PORT: ${port}`));