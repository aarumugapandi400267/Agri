import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  fullName: { type: String },
  phone: { type: String },
  pincode: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: "India" },
  addressLine: { type: String },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Farmer", "Customer"], required: true },

    profileImage: {
      data: Buffer,
      contentType: String,
    },

    addresses: [addressSchema], // Array of address objects

    defaultAddressIndex: {
      type: Number,
      default: 0,
    },

    // Add these fields for farmers (optional for customers)
    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifsc: { type: String },
      upiId: { type: String }, // optional
      razorpayContactId: { type: String }, // after creating contact in Razorpay
      razorpayFundAccountId: { type: String }, // after creating fund account in Razorpay
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

export default mongoose.model("User", userSchema);
