import { useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Paper,
  Typography,
  Box,
  Fade
} from "@mui/material";
import LoginForm from "../../components/Farmer/Auth/LoginForm";
import RegisterForm from "../../components/Farmer/Auth/RegisterForm";

const AuthPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleLogin = (data) => {
    console.log("Login Data:", data);
    // Call login API here
  };

  const handleRegister = (data) => {
    console.log("Register Data:", data);
    // Call register API here
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #c2e9fb, #81a4fd)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#1e2a78" }}
        >
          🌾 FARKIT
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#f0f0f0",
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Fade in={true}>
          <Box sx={{ mt: 2 }}>
            {tabIndex === 0 ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <RegisterForm onRegister={handleRegister} />
            )}
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
};

export default AuthPage;
