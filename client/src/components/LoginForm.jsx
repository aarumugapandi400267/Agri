import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {

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
