import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import docRouter from "./routes/docRoutes.js";

const app = express();
const port = process.env.PORT || 5000; 

// Database Connection
connectDB();

// 👇 UPDATED: Ab yeh Localhost aur Production URL dono ko allow karega
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL // Yeh humne Render ke settings me daala tha
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
app.get("/", (req, res) => res.send("API Working on Port 5000"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/document", docRouter);

// Server Start
app.listen(port, () => console.log(`Server started on PORT: ${port}`));