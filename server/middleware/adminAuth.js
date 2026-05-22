import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.body = req.body || {};
            req.body.adminId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;