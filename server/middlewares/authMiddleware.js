import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") 
        ? req.headers.authorization.split(" ")[1] 
        : null;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

// 🔹 Restrict Access to Specific Roles
export const restrictTo = (...roles) => (req, res, next) => {
    console.log(req.user.role)
    console.log(req.user.name)
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};
