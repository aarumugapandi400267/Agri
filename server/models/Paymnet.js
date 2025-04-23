import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  status: {
    type: String,
    default: "created", // "created", "paid", etc.
  },
});

const Order = mongoose.model("Payment", orderSchema);

export default Order;
