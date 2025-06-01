import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Tabs, Tab, Card, CardContent, Grid, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Avatar, Paper, Chip, CircularProgress
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

function ProfileTab({ user }) {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Profile Information
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
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
      >
        Edit Profile
      </Button>
    </Card>
  );
}

function AddressTab({ user }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Saved Addresses</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
        >
          Add New Address
        </Button>
      </Box>
      
      {(user?.addresses || []).length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <LocationOff sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography color="text.secondary">No addresses saved yet</Typography>
          <Button variant="text" sx={{ mt: 2 }}>Add your first address</Button>
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
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Order History</Typography>
      
      {orders.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>No orders yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start shopping to see them here!
          </Typography>
          <Button variant="contained" href="/products">
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
              '&:hover': {
                boxShadow: 2
              }
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
              
              {(order.products || []).map((item, i) => (
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
                      {item.status === "CancelRequested" ? (
                        <span style={{ color: "#e65100", fontWeight: 600 }}>Cancel Requested</span>
                      ) : (
                        item.status || "Pending"
                      )}
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
              ))}
              
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
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => alert(`View order details ${order._id}`)}
                  >
                    View Details
                  </Button>
                  
                  {order.payment?.status !== "Completed" && order.payment?.status !== "paid" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => alert(`Redirecting to payment for order ${order._id}`)}
                    >
                      Pay Now
                    </Button>
                  )}
                  
                  {order.status !== "Delivered" && order.status !== "CancelRequested" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancelClick(order._id)}
                    >
                      Cancel Order
                    </Button>
                  )}
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