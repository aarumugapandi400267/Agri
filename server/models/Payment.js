import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    receipt: {
      type: String,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    // admin_approval_status: {
    //   type: String,
    //   enum: ["Accept", "Reject", "Pending"],
    //   default: "Pending",
    // },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Check if the model already exists before defining it
const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;