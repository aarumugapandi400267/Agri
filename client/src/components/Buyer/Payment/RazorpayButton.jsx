import React, { useState } from 'react';
import axios from 'axios';

const RazorpayButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Create order on backend
      const { data: order } = await axios.post('http://localhost:5000/api/payment/order', {
        amount: 500, // ₹500
      });

      // 2. Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Dhanush Mart',
        description: 'Purchase from your store',
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment
            const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert('✅ Payment successful & verified!');
          } catch (err) {
            console.error('❌ Verification failed', err);
            alert('❌ Payment verification failed');
          }
        },
        modal: {
          // 4. Handle modal close without payment
          ondismiss: async function () {
            try {
              await axios.post('http://localhost:5000/api/payment/cancel', {
                orderId: order.id,
              });
              alert('⚠️ Payment cancelled by user');
            } catch (err) {
              console.error('❌ Cancel update failed:', err);
            }
          },
        },
        prefill: {
          name: 'Dhanush',
          email: 'dhanush@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Dhanush Personal Store',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('❌ Payment error:', error);
      alert('Payment initialization failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        backgroundColor: '#3399cc',
        color: 'white',
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {loading ? 'Processing...' : 'Pay with Razorpay'}
    </button>
  );
};

export default RazorpayButton;
