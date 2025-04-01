import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../actions/authentication";
import {useNavigate} from "react-router-dom"

const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigator=useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Fix: Prevent default form submission

    const response =dispatch(login(loginData,navigator));
    
    if (response?.error) {
      console.error("Login failed:", response.error);
    } else {
      console.log("Login successful:", response);
      if (onLogin) onLogin(response); 
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
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
      />
      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
