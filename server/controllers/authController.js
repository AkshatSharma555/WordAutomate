import jwt from "jsonwebtoken";
import axios from "axios";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "wordautomate_users",
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

    const msResponse = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { displayName, mail, userPrincipalName, id } = msResponse.data;

    let userEmail = mail || userPrincipalName;

    if (userEmail) {
      userEmail = userEmail.trim().toLowerCase();
    }

    if (!userEmail || !userEmail.endsWith("@gst.sies.edu.in")) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. Only @gst.sies.edu.in emails allowed.",
      });
    }

    let profilePicUrl = "";

    try {
      const photoResponse = await axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "arraybuffer",
      });

      if (photoResponse.data) {
        const cloudRes = await uploadFromBuffer(photoResponse.data);
        profilePicUrl = cloudRes.secure_url;
      }
    } catch (err) {
      // Photo fetch failure is handled silently for better UX
    }

    let user = await userModel.findOne({ email: userEmail });

    if (!user) {
      user = new userModel({
        name: displayName,
        email: userEmail,
        microsoftId: id,
        authProvider: "microsoft",
        isAccountVerified: true,
        profilePicture: profilePicUrl,
        microsoftOriginalUrl: profilePicUrl,
        microsoftAccessToken: accessToken,
      });
      await user.save();
    } else {
      let isUpdated = false;

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

      user.microsoftAccessToken = accessToken;
      isUpdated = true;

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
      message: "Logged in successfully",
      userData: {
        name: user.name,
        email: user.email,
        isVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        microsoftOriginalUrl: user.microsoftOriginalUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
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
        microsoftOriginalUrl: user.microsoftOriginalUrl,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


