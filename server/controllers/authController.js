import jwt from "jsonwebtoken";
import axios from "axios";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper to upload buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "wordautomate_users"
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

export const microsoftLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: "No access token provided" });
    }

    // 1. Verify User with Microsoft Graph
    const msResponse = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { displayName, mail, userPrincipalName, id } = msResponse.data;
    const userEmail = mail || userPrincipalName;

    // Domain Locking
    if (!userEmail || !userEmail.toLowerCase().endsWith("@gst.sies.edu.in")) {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied. Only @gst.sies.edu.in emails allowed." });
    }

    // 2. Fetch Profile Picture
    let profilePicUrl = "";
    try {
      const photoResponse = await axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer"
      });

      if (photoResponse.data) {
        const cloudRes = await uploadFromBuffer(photoResponse.data);
        profilePicUrl = cloudRes.secure_url;
      }
    } catch (err) {
      console.log("Microsoft photo fetch failed (User might not have one).");
    }

    // 3. Find or Create User
    let user = await userModel.findOne({ email: userEmail });

    if (!user) {
      // NEW USER
      user = new userModel({
        name: displayName,
        email: userEmail,
        microsoftId: id,
        authProvider: "microsoft",
        isAccountVerified: true,
        profilePicture: profilePicUrl,
        microsoftOriginalUrl: profilePicUrl,
        // 👇 UPDATED: Save Access Token for Graph API usage
        microsoftAccessToken: accessToken 
      });
      await user.save();
    } else {
      // EXISTING USER
      let isUpdated = false;

      // Update Profile Pic Logic
      if (profilePicUrl) {
        if (user.microsoftOriginalUrl !== profilePicUrl) {
          user.microsoftOriginalUrl = profilePicUrl;
          isUpdated = true;
        }
        if (!user.profilePicture) {
          user.profilePicture = profilePicUrl;
          isUpdated = true;
        }
      }

      if (!user.microsoftId) {
        user.microsoftId = id;
        user.authProvider = "microsoft";
        user.isAccountVerified = true;
        isUpdated = true;
      }

      // 👇 UPDATED: Always update the token on login (because it expires)
      user.microsoftAccessToken = accessToken;
      isUpdated = true;

      if (isUpdated) await user.save();
    }

    // 4. Generate Session Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: "Logged in successfully",
      userData: {
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        microsoftOriginalUrl: user.microsoftOriginalUrl
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Authentication failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) return res.json({ success: false });

    return res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        microsoftOriginalUrl: user.microsoftOriginalUrl
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};