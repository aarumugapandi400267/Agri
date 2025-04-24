import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Payment.js"; 
import Account from "../models/BankDeatils.js"; // Assuming you have an Account model

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_Ypck42sDDhkdyk",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "0ueUpVrVcjHmsLoU2F53ba3V"
});

// ==========================
// 🔹 Create Order
// ==========================
export const order = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      amount,
      currency: "INR",
      receipt: razorpayOrder.receipt,
      razorpayOrderId: razorpayOrder.id,
      status: "created"

    });

    await newOrder.save();

    res.status(200).json(razorpayOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Payment order failed", error: error.message });
  }
};

// ==========================
// 🔹 Verify Payment
// ==========================
export const verify = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder
    });
  } catch (error) { 
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
  }
};

// ==========================
// 🔹 Cancel Payment
// ==========================
export const cancel = async (req, res) => {
  try {
    const { orderId } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order marked as cancelled" });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ success: false, message: "Failed to update cancellation", error: error.message });
  }
};

// ==========================
// 🔹 Account Deatils
// ==========================

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