import express from "express";
import {
  microsoftLogin,
  logout,
  isAuthenticated
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// Public Route: Login logic
authRouter.post("/microsoft-login", microsoftLogin);

// Public Route: Logout
authRouter.post("/logout", logout);

// Protected Route: Check if logged in (Requires Middleware)
authRouter.get("/is-auth", userAuth, isAuthenticated);

export default authRouter;