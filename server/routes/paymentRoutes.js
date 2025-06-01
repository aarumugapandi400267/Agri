import express from "express";
import * as PaymentMethods from "../controllers/paymentController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new Razorpay order (customer initiates payment)
router.post("/order", protect, PaymentMethods.order);

// Verify payment after Razorpay callback/webhook
router.post("/verify", PaymentMethods.verify);

// Cancel an order/payment
router.put("/cancel", protect, PaymentMethods.cancel);

router.patch("/cancel", protect, PaymentMethods.approveCancel);

router.put("/cancel-item", protect, PaymentMethods.cancelItem);

// Approve cancellation request for an item in an order
router.patch("/cancel-item", protect, PaymentMethods.approveCancelItem);

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

// Update the status of an item in an order (e.g., mark as shipped, delivered)
router.patch("/item-status", protect, PaymentMethods.updateItemStatus);

// Request a refund for an order/payment
router.post("/refund", protect, PaymentMethods.requestRefund);


export default router;