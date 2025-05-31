import express from "express"
import {getUserProfile,updateUserProfile,addUserAddress} from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js"
import upload from "../config/multer.js"

const router=express.Router()

router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,upload.single("profileImage"),updateUserProfile)
router.post("/address", protect,addUserAddress )

export default router