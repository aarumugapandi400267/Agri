import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/, // IFSC validation regex
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true, // optional: ensures uniqueness
  },
  is_valid: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists before defining it
const Account = mongoose.models.Bank_Account_Details || mongoose.model("Bank_Account_Details", accountSchema);

export default Account;
