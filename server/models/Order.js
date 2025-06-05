import mongoose from "mongoose";
import Product from "./Product.js";

const orderProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Farmer" if you have a separate Farmer model
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
  subtotal: { type: Number, required: true },
  variant: { type: String }, // Optional: for variant like size/color/weight
  payoutStatus: {
    type: String,
    enum: ["Pending", "Processing", "Paid"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: ["Pending","Processing" ,"Shipped", "OutForDelivery", "Delivered", "CancelRequested", "Cancelled"],
    default: "Pending",
  },
  cancelReason: { type: String }, // Optional: reason for cancellation
  trackingInfo: {
    trackingNumber: { type: String },
    carrier: { type: String },
    status: { type: String },
    updatedAt: { type: Date },
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [orderProductSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Shipped", "Delivered","CancelRequested"],
      default: "Pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    shippingAddress: { type: Object, required: true },
    deliveryInstructions: { type: String }, // Optional: special instructions from customer
    trackingNumber: { type: String }, // For shipment tracking
    estimatedDeliveryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  try {
    const productIds = this.products.map((item) => item.product); // Collect all product IDs
    const products = await Product.find({ _id: { $in: productIds } }); // Fetch all products in one query

    if (products.length !== productIds.length) {
      throw new Error("One or more products not found");
    }

    const productMap = products.reduce((map, product) => {
      map[product._id.toString()] = product; // Create a map of product IDs to product objects
      return map;
    }, {});

    let total = 0;

    for (const item of this.products) {
      const product = productMap[item.product.toString()];
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      item.subtotal = product.price * item.quantity;
      // Set the farmer for each product in the order
      item.farmer = product.farmer; // Assumes Product model has a 'farmer' field
      total += item.subtotal;
    }

    this.totalPrice = total;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Order", orderSchema);