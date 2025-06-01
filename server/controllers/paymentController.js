import dotenv from "dotenv";
dotenv.config();

import axios from "axios"
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import User from "../models/User.js"; // Make sure to import your User model

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const order = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        product: product._id,
        farmer: product.farmer, // <-- Add this line
        quantity: item.quantity,
        subtotal,
        variant: item.variant, // if you use variants
      });
    }

    // Optional: Check for edge case of total being 0
    if (totalAmount <= 0) {
      return res.status(400).json({ msg: "Total amount must be greater than zero" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const payment = new Payment({
      amount: totalAmount,
      currency: "INR",
      receipt: razorpayOrder.receipt,
      razorpayOrderId: razorpayOrder.id,
    });
    await payment.save();

    const orderDoc = new Order({
      user: userId,
      items: orderItems,
      totalPrice: totalAmount,
      status: "Pending",
      payment: payment._id,
      products:orderItems,
      razorpayOrderId: razorpayOrder.id,
      shippingAddress: req.body.shippingAddress,
    });
    await orderDoc.save();

    // --- Update product stock after order is placed (bulk update, no DML in loop) ---
    const bulkOps = orderItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } }
      }
    }));
    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }
    // --- End update product stock ---

    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      key: process.env.RAZORPAY_KEY_ID,
      orderItems: orderDoc.products,
      paymentId: payment._id,
      orderId: orderDoc._id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Something went wrong during order creation" });
  }
};


// ==========================
// 🔹 Verify Payment
// ==========================
export const verify = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = "paid";
  await payment.save();

  // Optionally update the order status
  const order = await Order.findOneAndUpdate(
    { payment: payment._id },
    { status: "Completed" },
    { new: true }
  );

  // --- Update product quantity after payment ---
  if (order && order.products && order.products.length > 0) {
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: -item.quantity } }, // Decrement quantity
        { new: true }
      );
    }
  }
  // --- End update product quantity ---

  // --- Payout to Farmers: Add this block ---
  if (order && order.products && order.products.length > 0) {
    // 1. Group amounts by farmer
    const farmerAmounts = {};
    for (const item of order.products) {
      const farmerId = item.farmer?.toString();
      if (!farmerId) continue;
      farmerAmounts[farmerId] = (farmerAmounts[farmerId] || 0) + item.subtotal;
    }

    // 2. Fetch all farmers in one go
    const farmerIds = Object.keys(farmerAmounts);
    const farmers = await User.find({ _id: { $in: farmerIds } });

    // 3. Create a map for quick lookup
    const farmerMap = {};
    farmers.forEach(farmer => {
      farmerMap[farmer._id.toString()] = farmer;
    });

    // 4. Loop payouts (no DB call inside loop)
    for (const [farmerId, amount] of Object.entries(farmerAmounts)) {
      const farmer = farmerMap[farmerId];
      if (
        !farmer?.bankDetails?.razorpayFundAccountId ||
        !process.env.RAZORPAY_PAYOUT_ACCOUNT
      ) continue;

      try {
        await razorpay.payouts.create({
          account_number: process.env.RAZORPAY_PAYOUT_ACCOUNT,
          fund_account_id: farmer.bankDetails.razorpayFundAccountId,
          amount: amount * 100,
          currency: "INR",
          mode: "IMPS",
          purpose: "payout",
          queue_if_low_balance: true,
          narration: `Payout for order ${order._id}`,
          reference_id: `order_${order._id}_farmer_${farmerId}`,
        });
      } catch (payoutErr) {
        console.error(`Payout failed for farmer ${farmerId}:`, payoutErr);
      }
    }
  }
  // --- End payout block ---

  res.json({ message: "Payment verified, order updated, and payouts initiated" });
};


// ==========================
// 🔹 Cancel Payment (Customer requests cancellation)
// ==========================
export const cancel = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    // Optionally, you can store the cancel reason in the order
    const update = { status: "CancelRequested" };
    if (reason) update.cancelReason = reason;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, status: { $nin: ["Cancelled", "Delivered"] } }, // Don't allow if already cancelled/delivered
      update,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found or cannot be cancelled" });
    }

    // Optionally, notify farmer/admin here (e.g., via email or notification system)

    res.status(200).json({ success: true, message: "Cancellation request submitted", order: updatedOrder });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ success: false, message: "Failed to update cancellation", error: error.message });
  }
};

// ==========================
// 🔹 Approve Cancel (Farmer approves cancellation)
// ==========================
export const approveCancel = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Only allow if status is CancelRequested
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, status: "CancelRequested" },
      { status: "Cancelled", cancelledAt: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found or not in CancelRequested state" });
    }

    if (updatedOrder?.payment?.status==="paid") {
      await requestRefund({ paymentId: updatedOrder.payment, reason: "Order cancelled by farmer" });
    }

    // Optionally, notify customer/admin here

    res.status(200).json({ success: true, message: "Order cancelled by farmer", order: updatedOrder });
  } catch (error) {
    console.error("Approve cancel error:", error);
    res.status(500).json({ success: false, message: "Failed to approve cancellation", error: error.message });
  }
};

export const createAccount = async (req, res) => {
  const { name, email, contact, ifsc, accountNumber } = req.body;

  if (!name || !email || !contact || !ifsc || !accountNumber) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // 1. Create Contact
    const contactRes = await axios.post(
      'https://api.razorpay.com/v1/contacts',
      {
        name,
        email,
        contact,
        type: 'vendor',
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const contactId = contactRes.data.id;

    // 2. Create Fund Account
    const fundAccountRes = await axios.post(
      'https://api.razorpay.com/v1/fund_accounts',
      {
        contact_id: contactId,
        account_type: 'bank_account',
        bank_account: {
          name,
          ifsc,
          account_number: accountNumber,
        },
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // 3. Update User's bankDetails with Razorpay IDs
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "bankDetails.razorpayContactId": contactId,
          "bankDetails.razorpayFundAccountId": fundAccountRes.data.id,
          "bankDetails.accountHolderName": name,
          "bankDetails.accountNumber": accountNumber,
          "bankDetails.ifsc": ifsc,
        }
      },
      { new: true }
    );

    res.status(201).json({
      status: 'success',
      contact: contactRes.data,
      fundAccount: fundAccountRes.data,
    });
  } catch (error) {
    console.error('RazorpayX Account creation failed:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'RazorpayX account creation failed',
      details: error?.response?.data || error.message,
    });
  }
};


const isValidIFSC = (ifsc) => {
  const ifscPattern = /^[A-Za-z]{4}0[A-Z0-9]{6}$/;
  return ifscPattern.test(ifsc);
};

// Function to validate Account Number (9-18 digits)
const isValidAccountNumber = (accountNumber) => {
  const accountPattern = /^\d{9,18}$/;
  return accountPattern.test(accountNumber);
};

export const verifyAccount = async (req, res) => {
  const { name, ifsc, accountNumber } = req.body;

  if (!name || !ifsc || !accountNumber) {
    return res.status(400).json({ valid: false, message: 'Name, IFSC, and Account Number are required' });
  }

  if (!isValidIFSC(ifsc)) {
    return res.status(400).json({ valid: false, message: 'Invalid IFSC Code' });
  }

  if (!isValidAccountNumber(accountNumber)) {
    return res.status(400).json({ valid: false, message: 'Invalid Account Number' });
  }

  try {
    // Check if the account already exists
    const existingAccount = await Account.findOne({ accountNumber, ifsc });

    if (existingAccount) {
      return res.status(200).json({
        valid: true,
        message: 'Account already exists and is previously verified',
        data: existingAccount,
      });
    }

    // Simulate a successful account validation
    const mockResponse = {
      status: 'success',
      data: {
        account_number: accountNumber,
        ifsc,
        name,
        is_valid: true,
        message: 'Account successfully validated in test mode',
      },
    };

    if (mockResponse.status === 'success') {
      // Save verified account
      const newAccount = new Account({
        name,
        ifsc,
        accountNumber,
        is_valid: true,
        verifiedAt: new Date(),
      });

      await newAccount.save();

      res.status(200).json({
        valid: true,
        message: mockResponse.data.message,
        data: mockResponse.data,
        account: newAccount,
      });
    } else {
      res.status(400).json({
        valid: false,
        message: 'Account validation failed in test mode',
        data: mockResponse.data,
      });
    }
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      valid: false,
      message: 'Error during account verification',
      error: error.message,
    });
  }
};

// Get total earnings for the logged-in farmer
export const getFarmerEarnings = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Find all completed orders containing this farmer's products
    const orders = await Order.find({
      status: { $in: ["Completed", "Delivered"] },
      "products.farmer": farmerId
    }).populate("products.product");

    let totalEarnings = 0;
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.farmer.toString() === farmerId.toString() && item.payoutStatus === "Paid") {
          totalEarnings += item.subtotal;
        }
      });
    });

    res.json({ totalEarnings });
  } catch (error) {
    console.error("Error fetching farmer earnings:", error);
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
};

// Get orders for the logged-in customer
export const getCustomerOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("products.farmer", "name")
      .populate("payment")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
};

// Get orders for the logged-in farmer
export const getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user._id.toString();

    // Find orders where any product belongs to this farmer
    const orders = await Order.find({ "products.farmer": farmerId })
      .populate("products.product")
      .populate("products.farmer", "name")
      .populate("payment")
      .populate("user", "name") // populate user name for frontend
      .sort({ createdAt: -1 });

    // Filter products in each order to only include those for this farmer
    const filteredOrders = orders.map(order => {
      const farmerProducts = order.products.filter(
        item => item.farmer && item.farmer._id.toString() === farmerId
      );
      return {
        ...order.toObject(),
        products: farmerProducts,
      };
    });

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Error fetching farmer orders:", error);
    res.status(500).json({ error: "Failed to fetch farmer orders" });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("products.product")
      .populate("products.farmer", "name")
      .populate("payment");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// ==========================
// 🔹 Request Refund
// ==========================
export const requestRefund = async (req, res) => {
  const { paymentId, reason } = req.body;
  const payment = await Payment.findById(paymentId);
  if (!payment || payment.status !== "paid") return res.status(400).json({ message: "Refund not possible" });

  await razorpay.payments.refund(payment.gatewayPaymentId, { amount: payment.amount * 100 });

  payment.status = "Processing";
  await payment.save();

  // Optionally, notify admin for manual approval
  res.json({ message: "Refund requested", status: payment.refundStatus });
};

// ==========================
// 🔹 Cancel Item (Customer requests cancellation for specific item)
// ==========================
export const cancelItem = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let updated = false;
    order.products = order.products.map(item => {
      if (
        item.product.toString() === productId &&
        !["Cancelled", "Delivered"].includes(item.status)
      ) {
        item.status = "CancelRequested";
        if (reason) item.cancelReason = reason;
        updated = true;
      }
      return item;
    });

    if (!updated) {
      return res.status(400).json({ success: false, message: "Item not found or cannot be cancelled" });
    }

    await order.save();

    // Optionally, notify farmer/admin here

    res.status(200).json({ success: true, message: "Cancellation request submitted for item", order });
  } catch (error) {
    console.error("Cancel item error:", error);
    res.status(500).json({ success: false, message: "Failed to update item cancellation", error: error.message });
  }
};

// ==========================
// 🔹 Approve Cancel Item (Farmer approves cancellation for specific item)
// ==========================
export const approveCancelItem = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let updated = false;
    order.products = order.products.map(item => {
      if (
        item.product.toString() === productId &&
        item.status === "CancelRequested"
      ) {
        item.status = "Cancelled";
        item.cancelledAt = new Date();
        updated = true;
      }
      return item;
    });

    if (!updated) {
      return res.status(400).json({ success: false, message: "Item not found or not in CancelRequested state" });
    }

    await order.save();

    // Optionally, trigger refund logic for this item if needed

    res.status(200).json({ success: true, message: "Item cancelled by farmer", order });
  } catch (error) {
    console.error("Approve cancel item error:", error);
    res.status(500).json({ success: false, message: "Failed to approve item cancellation", error: error.message });
  }
};

// ==========================
// 🔹 Update Item Status (Admin or Farmer updates the status of an item in the order)
// ==========================
export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, productId, status, trackingInfo } = req.body;
    const allowedStatuses = ["Pending", "Shipped", "OutForDelivery", "Delivered"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    let updated = false;
    order.products = order.products.map(item => {
      if (item.product.toString() === productId) {
        item.status = status;
        if (trackingInfo) {
          item.trackingInfo = {
            ...item.trackingInfo,
            ...trackingInfo,
            updatedAt: new Date()
          };
        }
        updated = true;
      }
      return item;
    });

    if (!updated) {
      return res.status(400).json({ success: false, message: "Item not found" });
    }

    await order.save();
    res.status(200).json({ success: true, message: "Item status updated", order });
  } catch (error) {
    console.error("Update item status error:", error);
    res.status(500).json({ success: false, message: "Failed to update item status", error: error.message });
  }
};