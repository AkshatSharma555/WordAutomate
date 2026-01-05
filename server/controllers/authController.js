import jwt from "jsonwebtoken";
import axios from "axios";
import userModel from "../models/userModel.js";

// Helper to check if email is allowed
const isAllowedEmail = (email) => {
    return email && email.endsWith("@gst.sies.edu.in");
};

export const microsoftLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ success: false, message: "No token" });

    // 1. Fetch User Info
    const msResponse = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { displayName, mail, userPrincipalName, id } = msResponse.data;
    let userEmail = (mail || userPrincipalName || "").trim().toLowerCase();

    if (!isAllowedEmail(userEmail)) {
      return res.status(403).json({ success: false, message: "Only @gst.sies.edu.in allowed." });
    }

    // 2. Fetch MS Photo & Convert to Base64 (Har login pe try karenge)
    let profilePicBase64 = "";
    try {
        const photoResponse = await axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: { Authorization: `Bearer ${accessToken}` },
            responseType: "arraybuffer",
        });

        if (photoResponse.data) {
            const base64Image = Buffer.from(photoResponse.data, 'binary').toString('base64');
            profilePicBase64 = `data:image/jpeg;base64,${base64Image}`;
        }
    } catch (err) {
        // Silent fail if photo doesn't exist
    }

    // 3. Database Operation
    let user = await userModel.findOne({ email: userEmail });

    if (!user) {
      // --- NEW USER ---
      user = new userModel({
        name: displayName,
        email: userEmail,
        microsoftId: id,
        authProvider: "microsoft",
        isAccountVerified: true,
        profilePicture: profilePicBase64,
        microsoftOriginalUrl: profilePicBase64,
        microsoftAccessToken: accessToken,
      });
      await user.save();
    } else {
      // --- EXISTING USER (SYNC LOGIC) ---
      let isUpdated = false;

      // Token update
      user.microsoftAccessToken = accessToken;
      isUpdated = true;

      // Sync MS ID
      if (!user.microsoftId) {
          user.microsoftId = id;
          user.authProvider = "microsoft";
          isUpdated = true;
      }

      // Auto-Update Photo Logic
      if (profilePicBase64) {
          if (user.profilePicture !== profilePicBase64) {
              user.profilePicture = profilePicBase64;
              user.microsoftOriginalUrl = profilePicBase64;
              isUpdated = true;
          }
      }

      if (isUpdated) await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logged in",
      userData: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        // 🔥 FIX: Added these fields so frontend knows profile is complete
        prn: user.prn || "",
        branch: user.branch || "",
        year: user.year || ""
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Auth failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
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
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        // 🔥 FIX: Added these fields here too for page refreshes
        prn: user.prn || "",
        branch: user.branch || "",
        year: user.year || ""
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};