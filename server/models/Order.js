import mongoose from "mongoose";
import Product from "./Product.js";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        subtotal: { type: Number, required: true }, // Changed to Number for simplicity
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate subtotal and total price
orderSchema.pre("save", async function (next) {
  try {
    let total = 0;

    // Iterate over products to calculate subtotal for each
    for (const item of this.products) {
      const product = await Product.findById(item.product); // Fetch product details
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      item.subtotal = product.price * item.quantity; // Calculate subtotal
      total += item.subtotal; // Add to total price
    }

    this.totalPrice = total; // Set total price for the order
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Order", orderSchema);