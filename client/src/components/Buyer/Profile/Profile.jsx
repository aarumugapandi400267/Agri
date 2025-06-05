/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import {
  Typography, Box, Tabs, Tab, Card, CardContent, Grid, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Avatar, Paper, Chip, CircularProgress, TextField
} from '@mui/material';
import {
  PersonOutline, LocationOnOutlined, SettingsOutlined,
  AnalyticsOutlined, ShoppingBagOutlined, Edit, Add,
  LocationOff, Home, Phone, Delete, Receipt, Paid,
  RateReview, Favorite, Category, ShoppingBag
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../actions/user';
import { getCustomerOrders, cancelOrder, cancelItem } from '../../../actions/order';
import { updateUser } from '../../../actions/user';
import { verifyPayment } from '../../../actions/customer/order'; // Adjust path if needed

// Helper functions
const getStatusColor = (status) => {
  switch(status) {
    case 'Delivered': return '#4caf50';
    case 'Shipped': return '#2196f3';
    case 'Processing': return '#ff9800';
    case 'CancelRequested': return '#f44336';
    default: return '#9e9e9e';
  }
};

const getStatusChipColor = (status) => {
  switch(status) {
    case 'Delivered': return 'success';
    case 'Shipped': return 'info';
    case 'Processing': return 'warning';
    case 'CancelRequested': return 'error';
    default: return 'default';
  }
};

function ProfileTab({ user, onUpdateProfile }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: null,
    preview: user?.profileImage || ""
  });
  const fileInputRef = useRef();

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({
        ...editData,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSave = () => {
    onUpdateProfile(editData);
    setEditOpen(false);
  };

  useEffect(() => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      image: null,
      preview: user?.profileImage || ""
    });
  }, [user]);

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Profile Information
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 80, height: 80, mr: 3, cursor: 'pointer' }}
          src={user?.profileImage}
          onClick={handleEditOpen}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
            <Typography>{new Date(user?.createdAt).toLocaleDateString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Last Login</Typography>
            <Typography>{new Date(user?.lastLogin).toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        startIcon={<Edit />}
        sx={{ mt: 3 }}
        onClick={handleEditOpen}
      >
        Edit Profile
      </Button>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80, mb: 2, cursor: 'pointer' }}
              src={editData.preview}
              onClick={handleAvatarClick}
            >
              {editData.name?.charAt(0)}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <Button variant="text" onClick={handleAvatarClick}>
              Change Photo
            </Button>
          </Box>
          <TextField
            margin="normal"
            label="Name"
            name="name"
            value={editData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Email"
            name="email"
            value={editData.email}
            onChange={handleChange}
            fullWidth
            disabled // Remove this line if you want email editable
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function AddressTab({ user }) {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const handleOpenDialog = () => setAddressDialogOpen(true);
  const handleCloseDialog = () => {
    if (!saving) setAddressDialogOpen(false);
  };

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    setSaving(true);
    // TODO: Replace with your actual save address logic (API call or dispatch)
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API
    setSaving(false);
    setAddressDialogOpen(false);
    // Optionally refresh addresses here
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Saved Addresses</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Add New Address
        </Button>
      </Box>
      
      {(user?.addresses || []).length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <LocationOff sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography color="text.secondary">No addresses saved yet</Typography>
          <Button variant="text" sx={{ mt: 2 }} onClick={handleOpenDialog}>Add your first address</Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {(user?.addresses || []).map((addr, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: addr.isDefault ? '2px solid' : '1px solid',
                  borderColor: addr.isDefault ? 'primary.main' : 'divider',
                  position: 'relative'
                }}
              >
                {addr.isDefault && (
                  <Chip 
                    label="Default"
                    color="primary"
                    size="small"
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                  />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Home sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography fontWeight={600}>{addr.name}</Typography>
                  </Box>
                  <Typography sx={{ mb: 1 }}>
                    {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    {addr.city}, {addr.state}, {addr.postalCode}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>{addr.country}</Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    <Phone sx={{ fontSize: 14, mr: 0.5 }} /> {addr.phone}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<Edit />}
                    >
                      Edit
                    </Button>
                    {!addr.isDefault && (
                      <Button 
                        variant="text" 
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={addressDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Full Name"
            name="name"
            value={newAddress.name}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Address Line 1"
            name="addressLine1"
            value={newAddress.addressLine1}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Address Line 2"
            name="addressLine2"
            value={newAddress.addressLine2}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="City"
            name="city"
            value={newAddress.city}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="State"
            name="state"
            value={newAddress.state}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Postal Code"
            name="postalCode"
            value={newAddress.postalCode}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Country"
            name="country"
            value={newAddress.country}
            onChange={handleAddressChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Phone"
            name="phone"
            value={newAddress.phone}
            onChange={handleAddressChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>Cancel</Button>
          <Button 
            onClick={handleSaveAddress} 
            variant="contained" 
            color="primary"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SettingsTab() {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Account Settings
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage your account preferences and security settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Change Password
            </Typography>
            <Button variant="outlined" fullWidth>
              Update Password
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Notification Preferences
            </Typography>
            <Button variant="outlined" fullWidth>
              Configure Notifications
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Delete Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Permanently delete your account and all associated data
            </Typography>
            <Button variant="outlined" color="error">
              Delete My Account
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Card>
  );
}

function StatsTab({ orders }) {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const reviewsGiven = 0;
  const wishlistItems = 0;
  
  const categoryCount = {};
  orders.forEach(order => {
    (order.products || []).forEach(item => {
      const cat = item.product?.category || "Unknown";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
  });
  const favoriteCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Shopping Statistics</Typography>
      
      <Grid container spacing={3}>
        {[
          { value: totalOrders, label: 'Total Orders', icon: <Receipt />, color: 'primary' },
          { value: `₹${totalSpent}`, label: 'Total Spent', icon: <Paid />, color: 'success' },
          { value: reviewsGiven, label: 'Reviews', icon: <RateReview />, color: 'warning' },
          { value: wishlistItems, label: 'Wishlist', icon: <Favorite />, color: 'error' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: `${stat.color}.light`,
                  color: `${stat.color}.dark`,
                  mr: 3
                }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
                  <Typography color="text.secondary">{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Favorite Category</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Category sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" color="primary" fontWeight={700}>
                {favoriteCategory}
              </Typography>
              <Typography color="text.secondary">Most purchased category</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function OrdersTab({ orders, onCancel, onCancelItem }) {
  const dispatch = useDispatch();
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isItemCancel, setIsItemCancel] = useState(false);

  // Helper: Should show item statuses?
  const shouldShowItemStatuses = (order) => {
    if (!order.products || order.products.length <= 1) return false;
    // If any item status differs from order status, show item statuses
    return order.products.some(item => item.status !== order.status);
  };

  // Helper: Should show only order status?
  const shouldShowOnlyOrderStatus = (order) => {
    if (!order.products || order.products.length === 0) return true;
    // All items same as order status
    return order.products.every(item => item.status === order.status);
  };

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

  const handlePayNow = async (order) => {
    setPayingOrderId(order._id);
    setPayLoading(true);
    try {
      const paymentData = { orderId: order._id, amount: order.totalPrice };
      const result = await dispatch(verifyPayment(paymentData));
      if (result && !result.error) {
        setAlert({ open: true, message: "Payment successful!", severity: "success" });
      } else {
        setAlert({ open: true, message: result.error || "Payment failed.", severity: "error" });
      }
    } catch (err) {
      setAlert({ open: true, message: "Payment failed.", severity: "error" });
    }
    setPayLoading(false);
    setPayingOrderId(null);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Order History</Typography>
      {orders.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>No orders yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start shopping to see them here!
          </Typography>
          <Button variant="contained" href="/home">
            Browse Products
          </Button>
        </Paper>
      ) : (
        orders.map((order) => (
          <Card 
            key={order._id} 
            sx={{ 
              mb: 3, 
              borderLeft: `4px solid ${getStatusColor(order.status)}`,
              '&:hover': { boxShadow: 2 }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontWeight={700}>Order #{order._id.slice(-8).toUpperCase()}</Typography>
                <Chip 
                  label={order.status} 
                  size="small"
                  color={getStatusChipColor(order.status)}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Show item statuses if needed */}
              {shouldShowItemStatuses(order) ? (
                (order.products || []).map((item, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      display: 'flex', 
                      mb: 2,
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1
                    }}
                  >
                    <Avatar 
                      src={item.product?.image} 
                      variant="rounded"
                      sx={{ width: 64, height: 64, mr: 2 }}
                    >
                      {item.product?.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600}>{item.product?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} × ₹{item.price} = ₹{item.subtotal}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Farmer: {item.farmer?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status:{" "}
                        <Chip
                          label={item.status}
                          size="small"
                          color={getStatusChipColor(item.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Typography>
                    </Box>
                    {item.status !== "Delivered" && item.status !== "Cancelled" && item.status !== "CancelRequested" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleItemCancelClick(order._id, item.product?._id)}
                        sx={{ alignSelf: 'center' }}
                      >
                        Cancel Item
                      </Button>
                    )}
                  </Box>
                ))
              ) : (
                // Show only order status and items (no item status chips)
                (order.products || []).map((item, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      display: 'flex', 
                      mb: 2,
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1
                    }}
                  >
                    <Avatar 
                      src={item.product?.image} 
                      variant="rounded"
                      sx={{ width: 64, height: 64, mr: 2 }}
                    >
                      {item.product?.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600}>{item.product?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} × ₹{item.price} = ₹{item.subtotal}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Farmer: {item.farmer?.name}
                      </Typography>
                    </Box>
                    {item.status !== "Delivered" && item.status !== "Cancelled" && item.status !== "CancelRequested" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleItemCancelClick(order._id, item.product?._id)}
                        sx={{ alignSelf: 'center' }}
                      >
                        Cancel Item
                      </Button>
                    )}
                  </Box>
                ))
              )}

              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2
              }}>
                <Typography variant="h6">
                  Total: <Typography component="span" fontWeight={700}>₹{order.totalPrice}</Typography>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {order.payment?.status !== "Completed" && order.payment?.status !== "paid" && order?.status!=="Cancelled" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePayNow(order)}
                      disabled={payLoading && payingOrderId === order._id}
                    >
                      {payLoading && payingOrderId === order._id ? "Processing..." : "Pay Now"}
                    </Button>
                  )}
                  {/* Uncomment below to allow order-level cancel if needed */}
                  {/* {order.status !== "Delivered" && order.status !== "CancelRequested" && order?.status!=="Cancelled" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelClick(order._id)}
                    >
                      Cancel Order
                    </Button>
                  )} */}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
      <Dialog open={confirmOpen} onClose={handleCancelDialogClose}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          {isItemCancel
            ? "Are you sure you want to request cancellation for this item?"
            : "Are you sure you want to request cancellation for this order?"}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Note: Cancellation requests are subject to approval.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>No, Keep It</Button>
          <Button 
            onClick={handleConfirmCancel} 
            color="error" 
            variant="contained"
          >
            Yes, Request Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(getUser()),
      dispatch(getCustomerOrders())
    ])
    .then(([userRes, ordersRes]) => {
      setOrders(ordersRes || []);
    })
    .catch(err => {
      setAlert({ open: true, message: "Failed to load profile data", severity: "error" });
    })
    .finally(() => setLoading(false));
  }, [dispatch]);

  // Update profile handler using dispatch (like farmer's profile)
  const handleUpdateProfile = async (data) => {
    setProfileLoading(true);
    try {
      // If you want to support image upload, use FormData as in the farmer's profile
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.image) {
        formData.append("profileImage", data.image);
      }
      await dispatch(updateUser(formData));
      setAlert({ open: true, message: "Profile updated successfully.", severity: "success" });
      dispatch(getUser());
    } catch {
      setAlert({ open: true, message: "Failed to update profile.", severity: "error" });
    }
    setProfileLoading(false);
  };

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" textAlign="center" sx={{ mb: 4, fontWeight: 700 }}>
        My Account
      </Typography>
      
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 4,
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: '4px 4px 0 0'
          }
        }}
      >
        <Tab 
          label="Profile" 
          icon={<PersonOutline />} 
          iconPosition="start" 
          sx={{ minHeight: 60 }} 
        />
        <Tab 
          label="Addresses" 
          icon={<LocationOnOutlined />} 
          iconPosition="start" 
          sx={{ minHeight: 60 }} 
        />
        <Tab 
          label="Settings" 
          icon={<SettingsOutlined />} 
          iconPosition="start" 
          sx={{ minHeight: 60 }} 
        />
        <Tab 
          label="Statistics" 
          icon={<AnalyticsOutlined />} 
          iconPosition="start" 
          sx={{ minHeight: 60 }} 
        />
        <Tab 
          label="Orders" 
          icon={<ShoppingBagOutlined />} 
          iconPosition="start" 
          sx={{ minHeight: 60 }} 
        />
      </Tabs>
      
      <Box>
        {tab === 0 && <ProfileTab user={user} onUpdateProfile={handleUpdateProfile} />}
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