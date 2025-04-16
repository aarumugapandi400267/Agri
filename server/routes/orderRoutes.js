import express from "express";
import {createOrder,getCustomerOrders,getFarmerOrders} from "../controllers/orderController.js"
import { protect,restrictTo } from "../middlewares/authMiddleware.js";

const router=express.Router()

router.post("/", protect, createOrder); // Customer creates an order
router.get("/customer", protect,restrictTo("Customer"), getCustomerOrders); // Customer views their orders
router.get("/farmer", protect,restrictTo("Farmer"), getFarmerOrders); // Farmer views related orders

export default router
