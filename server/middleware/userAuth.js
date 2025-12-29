import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // 1. Token Extraction: Cookie se token nikalo
    const { token } = req.cookies;

    // Agar token nahi mila
    if (!token) {
      return res.json({ 
        success: false, 
        message: "Not Authorized. Please Login Again." 
      });
    }

    // 2. Token Verification
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach User ID to Request
    // ⚠️ IMPORTANT: Yeh step tumhare Refresh Bug ko fix karega
    // Hum user ID ko request ke andar daal rahe hain taaki Controller usse padh sake
    
    if (tokenDecode.id) {
        // Ensure req.body exists (GET requests mein kabhi-kabhi body undefined hoti hai)
        req.body = req.body || {}; 
        
        // Controller ke liye ID set karo
        req.body.userId = tokenDecode.id; 
        
        // Standard practice ke liye yahan bhi set kar dete hain
        req.userId = tokenDecode.id; 
    } else {
      return res.json({ 
        success: false, 
        message: "Not Authorized. Invalid Token." 
      });
    }

    // 4. Move to Controller
    next();

  } catch (error) {
    console.error("JWT Error:", error.message);
    
    // Agar Token Expire ho gaya hai (3 hours baad)
    if (error.name === 'TokenExpiredError') {
        return res.json({ 
            success: false, 
            message: "Session Expired. Please Login Again." 
        });
    }

    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;