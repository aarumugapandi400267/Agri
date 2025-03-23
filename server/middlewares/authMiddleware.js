import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token = (req.headers.authorization && req.headers.authorization.startsWith("Bearer") 
            ? req.headers.authorization.split(" ")[1] 
            : null
        );

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentTime = Math.floor(Date.now() / 1000);

        // Ensure `lastActivity` exists in old tokens
        const lastActivity = decoded.lastActivity || currentTime;

        // Check for inactivity timeout (1 hour)
        if (currentTime - lastActivity > 3600) {
            return res.status(401).json({ message: "Session expired due to inactivity" });
        }

        req.user = await User.findById(decoded.id).select("-password");

        // Refresh token only if last activity is older than 15 minutes
        if (currentTime - lastActivity > 900) { // 900 seconds = 15 minutes
            const newToken = jwt.sign(
                { id: decoded.id, lastActivity: currentTime },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            res.cookie("token", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict"
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// 🔹 Improved `restrictTo` Middleware (Supports Multiple Roles)
export const restrictTo = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};
