import express from "express";
import {createOrder,getOrders} from "../controllers/orderController.js"
import { protect,restrictTo } from "../middlewares/authMiddleware.js";

const router=express.Router()

router.post("/",protect,restrictTo("Customer"),createOrder)
router.get("/",protect,getOrders)

export default router
