import React, { useEffect, useState } from 'react';
import { Typography, Box, Tabs, Tab, Card, CardContent, Grid, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../actions/user';

function ProfileTab({ user }) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Profile Info</Typography>
      <Typography>Name: {user?.name}</Typography>
      <Typography>Email: {user?.email}</Typography>
      {/* Add more profile info here */}
    </Box>
  );
}

function AddressTab({ user }) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Addresses</Typography>
      {(user?.addresses || []).map((addr, idx) => (
        <Card sx={{ mb: 2 }} key={idx}>
          <CardContent>
            <Typography fontWeight={600}>{addr.name}</Typography>
            <Typography>
              {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}
              {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
            </Typography>
            <Typography variant="body2" color="text.secondary">Phone: {addr.phone}</Typography>
          </CardContent>
        </Card>
      ))}
      <Button variant="outlined">Add New Address</Button>
    </Box>
  );
}

function SettingsTab() {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      {/* Add settings UI here */}
    </Box>
  );
}

function StatsTab({ user }) {
  // Replace these with real stats from user if available
  const stats = user?.stats || {
    totalOrders: 0,
    totalSpent: 0,
    reviewsGiven: 0,
    wishlistItems: 0,
    favoriteCategory: ''
  };
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Shopping Statistics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#f5f8fa" }}>
            <CardContent>
              <Typography variant="h4" color="primary" fontWeight={700}>{stats.totalOrders}</Typography>
              <Typography color="text.secondary">Total Orders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#f5f8fa" }}>
            <CardContent>
              <Typography variant="h4" color="primary" fontWeight={700}>₹{stats.totalSpent}</Typography>
              <Typography color="text.secondary">Total Spent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#f5f8fa" }}>
            <CardContent>
              <Typography variant="h4" color="secondary" fontWeight={700}>{stats.reviewsGiven}</Typography>
              <Typography color="text.secondary">Reviews Given</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#f5f8fa" }}>
            <CardContent>
              <Typography variant="h4" color="secondary" fontWeight={700}>{stats.wishlistItems}</Typography>
              <Typography color="text.secondary">Wishlist Items</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Typography variant="h6" color="primary" fontWeight={700}>{stats.favoriteCategory || "N/A"}</Typography>
              <Typography color="text.secondary">Favorite Category</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authenticationReducer.AuthData || {});
  const [tab, setTab] = useState(0);

  console.log(user);
  
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Box mt={4} maxWidth={700} mx="auto">
      <Typography variant="h5" textAlign="center" mb={2}>Your Profile</Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Profile" />
        <Tab label="Address" />
        <Tab label="Settings" />
        <Tab label="Stats" />
      </Tabs>
      <Box>
        {tab === 0 && <ProfileTab user={user} />}
        {tab === 1 && <AddressTab user={user} />}
        {tab === 2 && <SettingsTab />}
        {tab === 3 && <StatsTab user={user} />}
      </Box>
    </Box>
  );
}