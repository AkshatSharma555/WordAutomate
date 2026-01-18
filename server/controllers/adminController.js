import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

// 🔥 Register Admin
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

// 🔥 Login Admin
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

// 🔥 Logout Admin
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

// 🔥 Send Verification OTP
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

// 🔥 Verify Email
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

// 🔥 Check Auth Status
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔥 Send Password Reset OTP
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

// 🔥 Reset Password
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