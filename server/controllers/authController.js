import jwt from "jsonwebtoken";
import axios from "axios";
import userModel from "../models/userModel.js";

// --- MICROSOFT SSO LOGIN (The Main Function) ---
export const microsoftLogin = async (req, res) => {
  try {
    const { accessToken } = req.body; // Frontend se token aayega

    if (!accessToken) {
      return res.status(400).json({ success: false, message: "No access token provided" });
    }

    // 1. Verify Token with Microsoft Graph API
    // Hum Microsoft se puchenge: "Ye token kiska hai?"
    const msResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const { displayName, mail, userPrincipalName, id } = msResponse.data;
    
    // Kabhi kabhi 'mail' null hota hai, toh 'userPrincipalName' use karo
    const userEmail = mail || userPrincipalName; 

    // 2. Domain Security Check (Only College Emails)
    if (!userEmail || !userEmail.toLowerCase().endsWith('@gst.sies.edu.in')) {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied. Only @gst.sies.edu.in emails are allowed." 
      });
    }

    // 3. Check if User Exists in DB
    let user = await userModel.findOne({ email: userEmail });

    if (!user) {
      // CASE A: New User -> Auto Register
      user = new userModel({
        name: displayName,
        email: userEmail,
        microsoftId: id,
        authProvider: 'microsoft',
        isAccountVerified: true // College email hai toh verified hai
      });
      await user.save();
    } else {
      // CASE B: Existing User -> Update Info if needed
      if (!user.microsoftId) {
        user.microsoftId = id;
        user.authProvider = 'microsoft';
        user.isAccountVerified = true; // Ensure verified
        await user.save();
      }
    }

    // 4. Generate Session Token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 5. Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ 
      success: true, 
      message: "Logged in successfully",
      userData: {
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified
      }
    });

  } catch (error) {
    console.error("Microsoft Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Authentication failed with Microsoft" });
  }
};

// --- LOGOUT ---
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --- CHECK AUTH STATUS (For Frontend Protection) ---
export const isAuthenticated = async (req, res) => {
  try {
    // Agar request yahan tak aayi hai matlab middleware pass ho gaya
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};