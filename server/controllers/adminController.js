import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import transporter from "../config/nodemailer.js";
import User from "../models/userModel.js";
import Document from "../models/documentModel.js";
import FriendRequest from "../models/friendRequestModel.js";
import SharedDoc from "../models/sharedDocModel.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";


export const registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || "akshat123";
  if (secretKey !== ADMIN_SECRET) {
      return res.json({ success: false, message: "Invalid Secret Key! Authorization Failed." });
  }

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Welcome Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Admin Panel",
      text: `Welcome aboard Master! Your Admin account is all set up with email: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Admin Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login Successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
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

export const sendVerifyOtp = async (req, res) => {
  try {
    const { adminId } = req.body;
    const admin = await Admin.findById(adminId);

    if (admin.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    admin.verifyOtp = otp;
    admin.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await admin.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: admin.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", admin.email),
    };
    await transporter.sendMail(mailOption);

    res.json({ success: true, message: "Verification OTP Sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { adminId, otp } = req.body;

    if (!adminId || !otp) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    if (admin.verifyOtp === "" || admin.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (admin.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    admin.isAccountVerified = true;
    admin.verifyOtp = "";
    admin.verifyOtpExpireAt = 0;
    await admin.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    admin.resetOtp = otp;
    admin.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await admin.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: admin.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", admin.email),
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP, and new password are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    if (admin.resetOtp === "" || admin.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (admin.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetOtp = "";
    admin.resetOtpExpireAt = 0;
    await admin.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getAdminData = async (req, res) => {
  try {
    const { adminId } = req.body;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      adminData: {
        name: admin.name,
        email: admin.email,
        isAccountVerified: admin.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Database se saare users fetch karo, par password mat bhejo
    const users = await User.find({}).select("-password");
    
    if (!users) {
      return res.json({ success: false, message: "No users found" });
    }

    res.json({
      success: true,
      users: users,
      totalUsers: users.length
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, prn, branch, year } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, prn, branch, year },
            { new: true, runValidators: true }
        ).select("-password -microsoftAccessToken");

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Student details updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Student deleted permanently" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDocs = await Document.countDocuments();
        const totalConnections = await FriendRequest.countDocuments({ status: 'accepted' });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayDocs = await Document.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalDocs,
                totalConnections,
                todayDocs
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllDocuments = async (req, res) => {
    try {
        // Fetch docs and populate the 'userId' field to get the generator's name
        const docs = await Document.find()
            .populate('userId', 'name email prn') 
            .sort({ createdAt: -1 }); // Newest first

        res.json({
            success: true,
            documents: docs
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Delete from Document collection
        const deletedDoc = await Document.findByIdAndDelete(id);

        if (!deletedDoc) {
            return res.json({ success: false, message: "Document not found" });
        }

        // 2. Also delete related entries from sharedDoc collection 
        // (So users don't see broken links in their inbox)
        await SharedDoc.deleteMany({ document: id });

        // Note: Ideally, you should also delete the file from Cloudinary here 
        // using deletedDoc.pdfUrl, but we can add that later if needed.

        res.json({ success: true, message: "Document and related shares deleted permanently." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};