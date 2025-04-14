import { useState } from "react";
import { Container, Tabs, Tab, Paper, Typography, Box } from "@mui/material";
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
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Welcome to Farmers Market
                </Typography>

                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                <Box sx={{ mt: 2 }}>{tabIndex === 0 ? <LoginForm onLogin={handleLogin} /> : <RegisterForm onRegister={handleRegister} />}</Box>
            </Paper>
        </Container>
    );
};

export default AuthPage;
