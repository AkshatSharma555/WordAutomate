import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 5000; 

// Database Connection
connectDB();

const allowedOrigins = ["http://localhost:5173"];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true, // Cookies allow karne ke liye zaroori hai
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

// API Endpoints
app.get("/", (req, res) => res.send("API Working on Port 5000"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Server Start
app.listen(port, () => console.log(`Server started on PORT: ${port}`));