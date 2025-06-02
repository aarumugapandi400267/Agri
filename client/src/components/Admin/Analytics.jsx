import React from "react";
import { Box, Typography } from "@mui/material";

const Analytics = () => (
  <Box
    sx={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#f5f5f5",
      borderRadius: 2,
      mt: 4,
    }}
  >
    <Typography variant="h3" color="primary" gutterBottom>
      Analytics
    </Typography>
    <Typography variant="h5" color="text.secondary">
      Coming Soon...
    </Typography>
  </Box>
);

export default Analytics;