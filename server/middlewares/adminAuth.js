import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Checks if user is authenticated (token present and valid)
export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "Not authorized" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token not valid" });
  }
};

// Checks if user is an admin (role === "Admin")
export const isAdmin = (req, res, next) => {
  // If you have a separate Admin model, check req.admin (see your adminAuth.js)
  // If admin is a role in User, check req.user.role
  if (req.user && req.user.role === "Admin") {
    return next();
  }
  return res.status(403).json({ error: "Admin access required" });
};