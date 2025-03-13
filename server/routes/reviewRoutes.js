import express from "express";
import { addReview,getReviews } from "../controllers/reviewController.js";
import { protect,restrictTo } from "../middlewares/authMiddleware.js";

const router=express.Router()

router.post("/:productId",protect,restrictTo("Customer"),addReview)
router.get("/:productId",getReviews)

export default router;