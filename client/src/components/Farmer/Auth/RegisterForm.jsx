import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { register } from "../../../actions/authentication";
import { useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom"

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "", repeatPassword: "" };

    // Name validation (at least 5 characters)
    if (registerData.name.length < 5) {
      newErrors.name = "Name must be at least 5 characters long";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(registerData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    // Password validation
    const passwordRegex = /^[A-Z!@#$%^&*()_+{}\[\]:;<>,.?/~\\-].{5,}$/;
    if (!passwordRegex.test(registerData.password)) {
      newErrors.password =
        "Password must start with an uppercase letter or a special character and be at least 6 characters long";
      valid = false;
    }

    // Repeat password validation
    if (registerData.repeatPassword !== registerData.password) {
      newErrors.repeatPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(register(registerData,navigate))
    }
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
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        variant="outlined"
        margin="normal"
        value={registerData.email}
        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        value={registerData.password}
        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        fullWidth
        label="Repeat Password"
        type="password"
        variant="outlined"
        margin="normal"
        value={registerData.repeatPassword}
        onChange={(e) => setRegisterData({ ...registerData, repeatPassword: e.target.value })}
        error={!!errors.repeatPassword}
        helperText={errors.repeatPassword}
      />
      <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} type="submit">
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
