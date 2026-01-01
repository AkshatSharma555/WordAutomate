import userModel from "../models/userModel.js";
import imagekit from "../config/imagekit.js";
import { getFriendshipStatus } from "./friendController.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        microsoftOriginalUrl: user.microsoftOriginalUrl,
        theme: user.theme,
        prn: user.prn || "" ,
        branch: user.branch || "", 
        year: user.year || ""
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.userId;
    const file = req.file;
    const { removeBg } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    let transformationString = "w-300,h-300,fo-face,z-0.75";
    if (removeBg === "true") {
      transformationString += ",e-bgremove,f-png";
    }

    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `user_${userId}_${Date.now()}`,
      folder: "/wordautomate_profiles",
      useUniqueFileName: true,
      transformation: { pre: transformationString }
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.url },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error("ImageKit Error:", error);
    return res.status(500).json({ success: false, message: "Failed to upload image." });
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.profilePicture = user.microsoftOriginalUrl || "";
    await user.save();

    return res.json({
      success: true,
      message: "Profile picture reset successfully",
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Delete Pic Error:", error);
    return res.status(500).json({ success: false, message: "Failed to reset profile picture." });
  }
};

export const updateUserTheme = async (req, res) => {
  try {
    const userId = req.userId;
    const { theme } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { theme: theme },
      { new: true }
    );

    return res.json({ success: true, message: "Theme updated", theme: user.theme });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePersonalInfo = async (req, res) => {
    try {
        const userId = req.userId;
        
        // 👇 Request body se branch aur year bhi nikalo
        const { name, prn, branch, year } = req.body; 

        const updateData = {};

        // Name Validation
        if (name && name.trim().length >= 3) {
            updateData.name = name.trim();
        }

        // PRN Validation
        if (prn) {
            updateData.prn = prn.toUpperCase().trim();
        }
        
        // 👇 BRANCH & YEAR UPDATE LOGIC
        if (branch) updateData.branch = branch;
        if (year) updateData.year = year;

        const user = await userModel.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        );

        return res.json({ 
            success: true, 
            message: "Personal details updated", 
            name: user.name,
            prn: user.prn,
            // 👇 Response mein wapas bhejo
            branch: user.branch,
            year: user.year
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllStudents = async (req, res) => {
  try {
    const { branch, year, search } = req.query;
    
    const currentUserId = req.body.userId || req.user?._id;

    if (!currentUserId) {
        return res.json({ success: false, message: "User ID missing from request." });
    }

    let query = {
      _id: { $ne: currentUserId }
    };

    if (branch && branch !== 'null' && branch !== 'undefined') {
        query.branch = branch;
    }
    
    if (year && year !== 'null' && year !== 'undefined') {
        query.year = year;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }; 
    }

    const users = await userModel.find(query).select('name email profilePicture branch year prn');

    const usersWithStatus = await Promise.all(users.map(async (user) => {
      const status = await getFriendshipStatus(currentUserId, user._id);
      return { ...user.toObject(), friendStatus: status }; 
    }));

    res.json({ success: true, users: usersWithStatus });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};