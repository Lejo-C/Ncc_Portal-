const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const User = require("../models/User");

/**
 * Middleware to verify JWT token and load user from session
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.replace("Bearer ", "");

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if session exists and is valid
        const session = await Session.findOne({
            token,
            userId: decoded.id,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return res.status(401).json({ message: "Session expired or invalid" });
        }

        // Load user data
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach user and session to request
        req.user = user;
        req.session = session;
        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
