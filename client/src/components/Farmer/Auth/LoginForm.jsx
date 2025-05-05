import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../../actions/authentication";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 1,
          mt: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold" textAlign="center" color="primary">
          Login to Your Account
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            mt: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            py: 1.2,
            transition: "0.3s",
            ":hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;
