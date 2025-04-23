import Razorpay from "razorpay";
import express from "express";
import dotenv from "dotenv";
import Order from "../models/Paymnet.js"; // Import the Order model

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/order
router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Save the order details to MongoDB
    const newOrder = new Order({
      amount: amount,
      currency: "INR",
      receipt: order.receipt,
      razorpayOrderId: order.id,
    });
    
    
    const newOrders = await newOrder.save();
    console.log('New Order saved:', newOrders);

    // Respond with the order
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Payment order failed", error: error.message });
  }
});

export default router;
