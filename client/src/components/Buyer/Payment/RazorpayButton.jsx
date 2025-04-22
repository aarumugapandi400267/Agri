
    import React from "react";

    const RazorpayButton = () => {
    const handlePayment = () => {
        const options = {
        key: "rzp_test_Ypck42sDDhkdyk", 
        amount: 50000, 
        currency: "INR",
        name: "Farkit",
        description: "Payment for services",
        image: "/src/assets/farkit-logo.png", 
        handler: function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            
        },
        prefill: {
            name: "John Doe",
            email: "john@example.com",
            contact: "9999999999",
        },
        notes: {
            address: "Farkit Corp, India",
        },
        theme: {
            color: "#4caf50",
        },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <button onClick={handlePayment} style={{ padding: "10px 20px", background: "#1976d2", color: "white", border: "none", borderRadius: "8px", fontSize: "16px" }}>
        Pay ₹500
        </button>
    );
    };

    export default RazorpayButton;
