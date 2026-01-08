import userModel from "../models/userModel.js";
import { getFriendshipStatus } from "./friendController.js";

// GET USER DATA
export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

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
                theme: user.theme,
                prn: user.prn || "",
                branch: user.branch || "",
                year: user.year || ""
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE THEME
export const updateUserTheme = async (req, res) => {
    try {
        // Middleware se userId lena (Support both styles)
        const userId = req.body.userId || req.userId;
        const { theme } = req.body;

        // 1. Security Check: Validation
        if (!theme || !['light', 'dark'].includes(theme)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid theme value. Must be 'light' or 'dark'." 
            });
        }

        // 2. Database Update
        const user = await userModel.findByIdAndUpdate(
            userId,
            { theme: theme },
            { new: true } // 🔥 Returns the updated document immediately
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, theme: user.theme });

    } catch (error) {
        console.error("Update Theme Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
// UPDATE PERSONAL INFO (ONBOARDING)
export const updatePersonalInfo = async (req, res) => {
    try {
        const { name, prn, branch, year } = req.body;
        const updateData = {};

        // Data Validation & Cleanup
        if (name && name.trim().length >= 2) updateData.name = name.trim();
        if (prn) updateData.prn = prn.toUpperCase().trim();
        if (branch) updateData.branch = branch;
        if (year) updateData.year = year;

        // Mark account as verified to complete onboarding
        updateData.isAccountVerified = true;

        const user = await userModel.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Details updated successfully",
            name: user.name,
            prn: user.prn,
            branch: user.branch,
            year: user.year,
            isAccountVerified: true
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET ALL STUDENTS (EXPLORE SECTION)
export const getAllStudents = async (req, res) => {
    try {
        const { branch, year, search } = req.query;
        // Use req.userId from middleware for consistency and security
        const currentUserId = req.userId;

        let query = { _id: { $ne: currentUserId } };

        if (branch && branch !== 'null' && branch !== 'undefined') query.branch = branch;
        if (year && year !== 'null' && year !== 'undefined') query.year = year;
        if (search) query.name = { $regex: search, $options: 'i' };

        const users = await userModel.find(query).select('name email profilePicture branch year prn');

        const usersWithStatus = await Promise.all(users.map(async (user) => {
            try {
                const status = await getFriendshipStatus(currentUserId, user._id);
                return { ...user.toObject(), friendStatus: status };
            } catch (e) {
                // Fallback if friendship status check fails
                return { ...user.toObject(), friendStatus: 'none' };
            }
        }));

        res.status(200).json({ success: true, users: usersWithStatus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};