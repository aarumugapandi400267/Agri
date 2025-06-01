import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "Bank Transfer",
    },
    transactionId: String,
    remarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payout", payoutSchema);