import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  receipt: {
    type: String,
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  admin_approval_status: {
    type: String,
    enum: ["Accept", "Reject", "Pending"],
    default: "Pending"
  },
});

// Check if the model already exists before defining it
const Order = mongoose.models.Payment || mongoose.model("payment", paymentSchema);

export default Order;