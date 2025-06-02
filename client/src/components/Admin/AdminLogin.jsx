import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminapi";
import { Box, Paper, Typography, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await adminLogin(email, password);
    if (res.token) {
      localStorage.setItem("adminToken", res.token);
      navigate("/admin/dashboard");
    } else {
      setError(res.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #b3d8fd 0%, #e3f0ff 100%)"
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
          textAlign: "center"
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img src="/src/assets/farkit-logo.png" alt="Logo" style={{ width: 70, marginBottom: 8 }} />
          <Typography variant="h4" fontWeight={700} color="#1e2a78" mb={1}>
            FARKIT
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            background: "#f7f7f7",
            borderRadius: "10px",
            mb: 3,
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              py: 1,
              background: "#fff",
              color: "#1976d2",
              fontWeight: 600,
              borderBottom: "3px solid #1976d2"
            }}
          >
             ADMIN LOGIN
          </Box>
        </Box>
        <Typography variant="h6" color="#1976d2" mb={3}>
          Login to Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoComplete="username"
            InputLabelProps={{ style: { color: "#1976d2" } }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            autoComplete="current-password"
            InputLabelProps={{ style: { color: "#1976d2" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(v => !v)}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 600,
              fontSize: "1.1rem",
              borderRadius: 2
            }}
          >
            Login
          </Button>
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}