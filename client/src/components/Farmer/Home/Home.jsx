import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* 🌄 Hero Section */}
      <Box
        sx={{
          minHeight: "90vh",
          backgroundImage: `url("/src/assets/FarKit-Image-background.png")`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4, // ✅ curved corners (theme spacing * 0.5 = 4px * 4 = 16px)
          boxShadow: 4, // ✅ soft shadow (you can try 2 or 6 for lighter/darker)
          overflow: "hidden", // ✅ hides overflow if corners cut off background
          m: 2, // optional margin for spacing from edge
        }}
      >

        {/* 🔗 Logo */}
        <Box
          component="img"
          src="/src/assets/farkit-logo.png"
          alt="Farkit Logo"
          sx={{
            position: "absolute",
            top: 12,
            left: 24,
            width: 200,
            filter:
              "brightness(0) saturate(100%) invert(17%) sepia(89%) saturate(7460%) hue-rotate(1deg) brightness(92%) contrast(120%)",
          }}
        />

        {/* 💬 Hero Content */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            mt: 18,
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(8px)",
              borderRadius: 4,
              p: 4,
              boxShadow: 3,
            }}
          >
            <Typography variant="h3" fontWeight={900} gutterBottom>
              Welcome to Farkit 🚜
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              Connecting farmers directly to vendors – no middleman, just growth.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2, mt: 2 }}
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            {/* <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => navigate("/auth")}
            >
              Register
            </Button> */}
          </Container>
        </Box>
      </Box>

      {/* 📄 Info Section */}
      <Box sx={{ backgroundColor: "#fffde7", py: 8, px: 2 }}>
        <Container
          maxWidth="md"
          sx={{
            border: "2px solid #81c784",
            borderRadius: 4,
            p: 4,
            backgroundColor: "#fffde7",
            boxShadow: 4,
          }}
        >
          <Typography
            variant="h3"
            fontWeight={900}
            color="primary"
            gutterBottom
            align="center"
          >
            About Farkit
          </Typography>

          <Typography
            variant="h6"
            color="textPrimary"
            sx={{ mb: 3 }}
            align="center"
          >
            Farkit is a digital platform built to connect farmers and vendors
            directly. By eliminating the middleman, we empower farmers to earn
            more while providing vendors with fresh, local produce.
          </Typography>

          <Typography variant="h6" color="textPrimary" align="center">
            Whether you’re a small-scale farmer or a local grocery shop owner,
            Farkit gives you the tools to connect, trade, and grow — efficiently
            and transparently.
          </Typography>
        </Container>
      </Box>
      {/* 🔻 Footer */}
      <Box sx={{ backgroundColor: "#fff9c4", py: 4, px: 2, mt: 4 }}>
        <Container maxWidth="lg">
          {/* 🌐 Side-by-side About, Contact, Address */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              textAlign: "center",
            }}
          >
            {/* 🌱 About Us */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Farkit is on a mission to empower local farmers by connecting them
                directly with vendors — removing middlemen and creating growth for all.
              </Typography>
            </Box>

            {/* 📬 Contact */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                📞 Phone: 122-343-43
              </Typography>
              <Typography variant="body1" color="textSecondary">
                📧 Email: support@farkit-fake.com
              </Typography>
            </Box>

            {/* 🏠 Address */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                🏡 Farkit HQ<br />
                123 Greenfield Road<br />
                Agritown, FarmState, 999999
              </Typography>
            </Box>
          </Box>

          {/* 🔻 Footer Bottom Text */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Farkit. All rights reserved.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Made with ❤️ to support farmers & local vendors.
            </Typography>
          </Box>
        </Container>
      </Box>



    </>
  );
};

export default HomePage;
