import userModel from "../models/userModel.js";
import { getFriendshipStatus } from "./friendController.js";

// GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture, 
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


export const updateUserTheme = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.userId, { theme: req.body.theme }, { new: true });
    return res.json({ success: true, theme: user.theme });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePersonalInfo = async (req, res) => {
    try {
        const { name, prn, branch, year } = req.body; 
        const updateData = {};
        if (name && name.trim().length >= 3) updateData.name = name.trim();
        if (prn) updateData.prn = prn.toUpperCase().trim();
        if (branch) updateData.branch = branch;
        if (year) updateData.year = year;

        const user = await userModel.findByIdAndUpdate(req.userId, updateData, { new: true });
        return res.json({ success: true, message: "Details updated", name: user.name, prn: user.prn, branch: user.branch, year: user.year });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllStudents = async (req, res) => {
  try {
    const { branch, year, search } = req.query;
    const currentUserId = req.body.userId || req.user?._id;
    let query = { _id: { $ne: currentUserId } };
    
    if (branch && branch !== 'null' && branch !== 'undefined') query.branch = branch;
    if (year && year !== 'null' && year !== 'undefined') query.year = year;
    if (search) query.name = { $regex: search, $options: 'i' }; 

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