import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Avatar, Skeleton } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useDispatch } from "react-redux";
import { fetchDashboardKPIs } from "../../actions/admin"; // <-- Import the action

const StatCard = ({ title, value, icon, isLoading, growth }) => (
  <Card elevation={3} sx={{ borderRadius: 3 }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2", width: 56, height: 56 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        {isLoading ? (
          <Skeleton variant="text" width={80} height={36} />
        ) : (
          <Typography variant="h5" fontWeight={700}>
            {value?.toLocaleString()}
          </Typography>
        )}
        {growth !== undefined && !isLoading && (
          <Typography variant="caption" color={growth >= 0 ? "success.main" : "error.main"}>
            {growth >= 0 ? "+" : ""}
            {growth}% since last month
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboardKPIs()).then(data => {
      setKpis(data);
      setLoading(false);
    });
  }, [dispatch]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={4} color="#1e2a78">
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={kpis?.userCount}
            icon={<PeopleAltIcon fontSize="large" />}
            isLoading={loading}
            growth={kpis?.userGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Products Listed"
            value={kpis?.productCount}
            icon={<Inventory2Icon fontSize="large" />}
            isLoading={loading}
            growth={kpis?.productGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders"
            value={kpis?.orderCount}
            icon={<ShoppingCartIcon fontSize="large" />}
            isLoading={loading}
            growth={kpis?.orderGrowth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={kpis?.totalRevenue}
            icon={<MonetizationOnIcon fontSize="large" />}
            isLoading={loading}
            growth={kpis?.revenueGrowth}
          />
        </Grid>
      </Grid>
    </Box>
  );
}