import React from "react";
import RazorpayButton from "./RazorpayButton"; // adjust path if needed

import { Box } from "@mui/material";
const PaymentPage = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Make a Payment</h2>
      <RazorpayButton />
    </div>
  );
};

export default PaymentPage;
