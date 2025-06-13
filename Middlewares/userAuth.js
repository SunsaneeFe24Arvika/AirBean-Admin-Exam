import User from '../Models/modelUser.js';
import { verifyToken } from '../Utils/index.js';

// Middleware för att autentisera JWT
export async function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }

    req.userId = decoded.userId; // Använd userId från tokenen
    next();
}

// Middleware för att verifiera att användaren är admin
export async function adminVerification(req, res, next) {
    try {
        const user = await User.findOne({ userId: req.userId });
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}