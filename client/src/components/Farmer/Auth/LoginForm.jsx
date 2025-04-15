import { useState } from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../../actions/authentication";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(login(loginData, navigator));

      if (response?.error) {
        setSnackbar({
          open: true,
          message: "Login failed. Please check your credentials.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        if (onLogin) onLogin(response);
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Snackbar at the top center */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
          Login
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;
