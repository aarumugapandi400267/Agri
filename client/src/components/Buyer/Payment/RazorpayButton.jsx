import React from "react";
import axios from "axios";

const RazorpayButton = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your connection.");
      return;
    }

    try {
      // Replace with your real backend URL
      const { data: order } = await axios.post("http://localhost:5000/api/paymnet/order", {
        amount: 500
      });

      const options = {
        key: "rzp_test_Ypck42sDDhkdyk", // Replace with Razorpay Key ID (from .env)
        amount: order.amount,
        currency: order.currency,
        name: "My Store",
        description: "Payment for Order",
        order_id: order.id,
        handler: function (response) {
          alert("Payment successful!");
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
      Pay ₹5
    </button>
  );
};

export default RazorpayButton;
