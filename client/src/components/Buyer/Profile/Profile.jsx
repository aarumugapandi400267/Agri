import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Tabs, Tab, Card, CardContent, Grid, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../actions/user';
import { getCustomerOrders, cancelOrder, cancelItem } from '../../../actions/order';

function ProfileTab({ user }) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Profile Info</Typography>
      <Typography>Name: {user?.name}</Typography>
      <Typography>Email: {user?.email}</Typography>
    </Box>
  );
}

function AddressTab({ user }) {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Addresses</Typography>
      {(user?.addresses || []).length === 0 && (
        <Typography color="text.secondary">No addresses saved.</Typography>
      )}
      {(user?.addresses || []).map((addr, idx) => (
        <Card sx={{ mb: 2 }} key={idx}>
          <CardContent>
            <Typography fontWeight={600}>{addr.name}</Typography>
            <Typography>
              {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
              , {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
            </Typography>
            <Typography variant="body2" color="text.secondary">Phone: {addr.phone}</Typography>
          </CardContent>
        </Card>
      ))}
      <Button variant="outlined" sx={{ mt: 2 }}>Add New Address</Button>
    </Box>
  );
}

function SettingsTab() {
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Typography color="text.secondary">Settings coming soon.</Typography>
    </Box>
  );
}

function StatsTab({ orders }) {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  // Placeholder: reviewsGiven and wishlistItems would come from user data or another source
  const reviewsGiven = 0;
  const wishlistItems = 0;
  // Calculate favorite category (most frequent product category)
  const categoryCount = {};
  orders.forEach(order => {
    (order.products || []).forEach(item => {
      const cat = item.product?.category || "Unknown";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  const favoriteCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const stats = {
    totalOrders,
    totalSpent,
    reviewsGiven,
    wishlistItems,
    favoriteCategory,
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
              <Typography variant="h6" color="primary" fontWeight={700}>{stats.favoriteCategory}</Typography>
              <Typography color="text.secondary">Favorite Category</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// --- Order Details Tab ---
function OrdersTab({ orders, onCancel, onCancelItem }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isItemCancel, setIsItemCancel] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsItemCancel(false);
    setConfirmOpen(true);
  };

  const handleItemCancelClick = (orderId, itemId) => {
    setSelectedOrderId(orderId);
    setSelectedItemId(itemId);
    setIsItemCancel(true);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      if (isItemCancel && selectedOrderId && selectedItemId) {
        console.log(selectedItemId);
        console.log(selectedOrderId);
        await onCancelItem(selectedOrderId, selectedItemId);
        setAlert({ open: true, message: "Item cancellation requested.", severity: "success" });
      } else if (selectedOrderId) {
        await onCancel(selectedOrderId);
        setAlert({ open: true, message: "Order cancellation requested.", severity: "success" });
      }
    } catch (err) {
      setAlert({ open: true, message: err.message, severity: "error" });
    }
    setConfirmOpen(false);
    setSelectedOrderId(null);
    setSelectedItemId(null);
    setIsItemCancel(false);
  };

  const handleCancelDialogClose = () => {
    setConfirmOpen(false);
    setSelectedOrderId(null);
    setSelectedItemId(null);
    setIsItemCancel(false);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Order History</Typography>
      {orders.length === 0 && (
        <Typography color="text.secondary">No orders found.</Typography>
      )}
      {orders.map((order, idx) => (
        <Card sx={{ mb: 2 }} key={order._id || idx}>
          <CardContent>
            <Typography fontWeight={600}>Order #{order._id}</Typography>
            <Typography>Date: {new Date(order.createdAt).toLocaleString()}</Typography>
            <Typography>
              Status:{" "}
              {order.status === "CancelRequested" ? (
                <span style={{ color: "#e65100", fontWeight: 600 }}>Cancel Requested</span>
              ) : (
                order.status
              )}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography fontWeight={600}>Items:</Typography>
            {(order.products || []).map((item, i) => (
              <Box key={i} sx={{ ml: 2, mb: 1 }}>
                <Typography>
                  {item.product?.name || 'Product'} &times; {item.quantity} — ₹{item.subtotal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Farmer: {item.farmer?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Item Status:{" "}
                  {item.status === "CancelRequested" ? (
                    <span style={{ color: "#e65100", fontWeight: 600 }}>Cancel Requested</span>
                  ) : (
                    item.status || "Pending"
                  )}
                </Typography>
                {/* Show Cancel Item if not delivered/cancelled/cancel requested */}
                {item.status !== "Delivered" && item.status !== "Cancelled" && item.status !== "CancelRequested" && (
                  <Box mt={1} display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleItemCancelClick(order._id, item.product?._id)}
                    >
                      Cancel This Item
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography>Total: ₹{order.totalPrice}</Typography>
            <Typography variant="body2" color="text.secondary">
              Payment Status: {order.payment?.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shipping: {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
            </Typography>
            {/* Show Pay Now only if payment is not Completed or Paid */}
            {order.payment?.status !== "Completed" && order.payment?.status !== "paid" && (
              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => alert(`Redirecting to payment for order ${order._id}`)}
                >
                  Pay Now
                </Button>
              </Box>
            )}
            {/* Show Cancel Order if not delivered and not already requested */}
            {order.status !== "Delivered" && order.status !== "CancelRequested" && (
              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancelClick(order._id)}
                >
                  Cancel Entire Order
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancelDialogClose}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          {isItemCancel
            ? "Are you sure you want to request cancellation for this item?"
            : "Are you sure you want to request cancellation for this order?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">
            Yes, Request Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authenticationReducer.AuthData || {});
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(getUser());
    dispatch(getCustomerOrders()).then(res => {
      setOrders(res || []);
    });
  }, [dispatch]);

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId));
      setAlert({ open: true, message: "Order cancellation requested.", severity: "success" });
      dispatch(getCustomerOrders()).then(res => {
        setOrders(res || []);
      });
    } catch {
      setAlert({ open: true, message: "Failed to request order cancellation.", severity: "error" });
    }
  };

  // Cancel item handler
  const handleCancelItem = async (orderId, itemId) => {
    try {
      await dispatch(cancelItem(orderId, itemId));
      setAlert({ open: true, message: "Item cancellation requested.", severity: "success" });
      dispatch(getCustomerOrders()).then(res => {
        setOrders(res || []);
      });
    } catch {
      setAlert({ open: true, message: "Failed to request item cancellation.", severity: "error" });
    }
  };

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
        <Tab label="Orders" />
      </Tabs>
      <Box>
        {tab === 0 && <ProfileTab user={user} />}
        {tab === 1 && <AddressTab user={user} />}
        {tab === 2 && <SettingsTab />}
        {tab === 3 && <StatsTab orders={orders} />}
        {tab === 4 && (
          <OrdersTab
            orders={orders}
            onCancel={handleCancelOrder}
            onCancelItem={handleCancelItem}
          />
        )}
      </Box>
      {/* Global Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}