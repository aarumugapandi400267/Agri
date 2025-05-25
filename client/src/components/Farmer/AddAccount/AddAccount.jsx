import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

export default function AddAccount() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    ifsc: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Replace with your backend endpoint for Razorpay account creation
      const res = await fetch("/api/razorpay/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Account created successfully!");
        setForm({ name: "", email: "", contact: "", ifsc: "", accountNumber: "" });
      } else {
        setMsg(data.error || "Failed to create account.");
      }
    } catch (err) {
      setMsg("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Razorpay Account
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          type="email"
        />
        <TextField
          label="Contact Number"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="IFSC Code"
          name="ifsc"
          value={form.ifsc}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Account Number"
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>
        {msg && (
          <Typography color={msg.includes("success") ? "green" : "error"} sx={{ mt: 2 }}>
            {msg}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}