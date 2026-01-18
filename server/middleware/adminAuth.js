import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  // Hum cookie se token nikaal rahe hain
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // 🔥 CHANGE: Hum isse 'adminId' mein store karenge taaki main app se conflict na ho
      // Aur hum isse req.body mein bhi daal rahe hain taaki controller access kar sake
      req.body.adminId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;