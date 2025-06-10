import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchDashboardKPIs } from "../../actions/admin";

const Analytics = () => {
  const dispatch = useDispatch();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getKPIs = async () => {
      setLoading(true);
      try {
        const data = await dispatch(fetchDashboardKPIs());
        setKpis(data);
      } catch (err) {
        console.log(err);
        setKpis(null);
      } finally {
        setLoading(false);
      }
    };
    getKPIs();
  }, [dispatch]);

  return (
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
        px: 2,
      }}
    >
      <Typography variant="h3" color="primary" gutterBottom>
        Analytics
      </Typography>
      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : kpis ? (
        <Grid container spacing={3} sx={{ mt: 2, maxWidth: 600 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", borderRadius: 3 }}
            >
              <Typography variant="h5" color="secondary">
                {kpis.userCount}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Users
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", borderRadius: 3 }}
            >
              <Typography variant="h5" color="secondary">
                {kpis.productCount}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Products
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, textAlign: "center", borderRadius: 3 }}
            >
              <Typography variant="h5" color="secondary">
                {kpis.orderCount}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Orders
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Failed to load analytics.
        </Typography>
      )}
    </Box>
  );
};

export default Analytics;