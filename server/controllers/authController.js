import User from "../models/User.js";
import generateToken from "../config/jwt.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        // Check if all required fields are provided
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please fill all fields" })
        }
        const userExists = await User.findOne({ email: email })
        if (userExists) return res.status(400).json({
            message: "User already Exists"
        }    
    )
        if (password.length < 6) return res.status(400).json({
            message: "Password must be at least 6 characters long"
        })
        if (!/^[A-Z!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]/.test(password)) {
            return res.status(400).json({
                message: "Password must start with an uppercase letter or a special character"
            });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Invalid email format"
    });
}

        if (role !== "Farmer" && role !== "Customer") return res.status(400).json({
            message: "Role must be either Farmer or Customer"
        })
        const user = await User.create({ name, email, password, role })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.name,
                role,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({
                message: "Invalid user data"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage:user.profileImage,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({
            message:"Server error"
        })
    }
}