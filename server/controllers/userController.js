import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            ...user.toObject(),
            profileImage: user.profileImage?.data
                ? `data:${user.profileImage.contentType};base64,${user.profileImage.data.toString("base64")}`
                : null,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        // Handle profile image update
        if (req.file) {
            user.profileImage = {
                data: req.file.buffer, // Store image as binary
                contentType: req.file.mimetype, // Store image type
            };
        }

        const updatedUser = await user.save();

        res.json({
            ...updatedUser.toObject(),
            profileImage: updatedUser.profileImage?.data
                ? `data:${updatedUser.profileImage.contentType};base64,${updatedUser.profileImage.data.toString("base64")}`
                : null,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
