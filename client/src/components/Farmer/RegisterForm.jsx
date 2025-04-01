import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(registerData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        margin="normal"
        value={registerData.name}
        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        variant="outlined"
        margin="normal"
        value={registerData.email}
        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        value={registerData.password}
        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
      />
      <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} type="submit">
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
