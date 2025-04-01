import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../actions/authentication";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const validate = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    if(!loginData.email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    // Email validation (must be a valid format)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!emailRegex.test(loginData.email)) {
    //   newErrors.email = "Invalid email format";
    //   valid = false;
    // }

    // Password validation (minimum 6 characters)
    if (loginData.password.length < 3) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Stop if validation fails

    try {
      const response = await dispatch(login(loginData, navigator));

      if (response?.error) {
        console.error("Login failed:", response.error);
      } else {
        console.log("Login successful:", response);
        if (onLogin) onLogin(response);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
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
  );
};

export default LoginForm;
