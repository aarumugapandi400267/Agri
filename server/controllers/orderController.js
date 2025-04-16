import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body; // [{ product, quantity }]
    const userId = req.user._id;

    // Role check: Only customers can place orders
    const user = await User.findById(userId);
    if (!user || user.role !== "Customer") {
      return res.status(403).json({ error: "Only customers can place orders." });
    }

    let totalPrice = 0;
    const productUpdates = [];

    // Validate products and prepare for batch update
    for (const item of products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ error: `Product with ID ${item.product} not found.` });
      }

      if (item.quantity > dbProduct.stock) {
        return res.status(400).json({ error: `Not enough stock for ${dbProduct.name}. Available: ${dbProduct.stock}` });
      }

      totalPrice += dbProduct.price * item.quantity;

      // Prepare product stock update
      dbProduct.stock -= item.quantity;
      productUpdates.push(dbProduct);
    }

    // Save all product updates at once
    await Promise.all(productUpdates.map(p => p.save()));

    // Create order after updating stock
    const newOrder = await Order.create({
      user: userId,
      products,
      totalPrice,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getCustomerOrders = async (req, res) => {
    try {
      const orders = await Order.find({ customer: req.user.id })
        .populate("products.product")
        .populate("customer", "name");
  
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
export const getFarmerOrders = async (req, res) => {
    try {
      const allOrders = await Order.find({})
        .populate({
          path: "products.product",
          match: { farmer: req.user.id },
          populate: { path: "farmer", select: "name" },
        })
        .populate("customer", "name");
  
      const farmerOrders = allOrders.filter(order =>
        order.products.some(p => p.product !== null)
      );
  
      res.json(farmerOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };