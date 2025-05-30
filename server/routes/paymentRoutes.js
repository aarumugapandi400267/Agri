import express from "express";
import * as PaymentMethods from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new Razorpay order (customer initiates payment)
router.post("/order", protect, PaymentMethods.order);

// Verify payment after Razorpay callback/webhook
router.post("/verify", PaymentMethods.verify);

// Cancel an order/payment
router.post("/cancel", protect, PaymentMethods.cancel);

// Verify bank account details (optional, for farmers)
router.post("/account/verify", protect, PaymentMethods.verifyAccount);

// Create Razorpay contact and fund account for farmer payouts
router.post("/account/create", protect, PaymentMethods.createAccount);

// (Optional) Add a route to fetch payout status/history for admin/farmer
// router.get("/payouts/:farmerId", protect, PaymentMethods.getPayouts);

// Route to get farmer earnings
router.get("/farmer/earnings", protect, PaymentMethods.getFarmerEarnings);

// Get all orders for the logged-in customer
router.get("/orders/customer", protect, PaymentMethods.getCustomerOrders);

// Get all orders for the logged-in farmer
router.get("/orders/farmer", protect, PaymentMethods.getFarmerOrders);

// Get order details by order ID (for both customer and farmer, if authorized)
router.get("/orders/:orderId", protect, PaymentMethods.getOrderById);

export default router;