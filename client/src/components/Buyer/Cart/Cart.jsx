/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Avatar,
  Badge,
  Chip,
  Tooltip,
  Paper,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  AddLocationAlt as AddLocationAltIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getCart,
  deleteCartItem,
  updateCartItem,
  clearCart,
} from "../../../actions/customer/cart";
import { placeOrder, verifyPayment } from "../../../actions/customer/order";
import { addUserAddress, getUser } from "../../../actions/user";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const steps = ["Cart", "Shipping", "Payment"];

export default function Cart() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authenticationReducer.AuthData);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    user?.defaultAddressIndex || 0
  );
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [activeStep, setActiveStep] = useState(0);
  const [newAddressDialogOpen, setNewAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    type: "home",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getCart());
      setCart(response.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    dispatch(getUser());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      console.log(id);
      await dispatch(deleteCartItem(id));
      fetchCart();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleUpdate = async (id, quantity) => {
    try {
      await dispatch(updateCartItem(id, quantity));
      fetchCart();
      setEditingItemId(null);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleEditClick = (id, currentQuantity) => {
    setEditingItemId(id);
    setEditedQuantity(currentQuantity);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setEditedQuantity(value);
  };

  const handleNextStep = () => {
    if (activeStep === 0 && (!user?.addresses || user.addresses.length === 0)) {
      setNewAddressDialogOpen(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const shippingAddress = user.addresses[selectedAddressIndex];
      const orderData = {
        products: cart.map((item) => ({
          product: item.productId._id,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress,
      };

      const response = await dispatch(placeOrder(orderData));

      if (response.razorpayOrderId && response.key) {
        const options = {
          key: response.key,
          amount: response.amount,
          currency: response.currency,
          order_id: response.razorpayOrderId,
          name: "Agri Marketplace",
          description: "Order Payment",
          handler: async function (paymentResponse) {
            try {
              setLoading(true);
              await dispatch(
                verifyPayment({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                })
              );
              showSnackbar("Payment successful!", "success");
              await dispatch(clearCart());
              fetchCart();
              setActiveStep(0);
            } catch (err) {
              showSnackbar("Payment verification failed. Please contact support.", "error");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: response.user?.name,
            email: response.user?.email,
          },
          theme: { color: theme.palette.primary.main },
          modal: {
            ondismiss: function () {
              setLoading(false);
              showSnackbar("Payment cancelled.", "info");
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        showSnackbar("Order placed successfully!", "success");
        await dispatch(clearCart());
        fetchCart();
        setActiveStep(0);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      showSnackbar("Order placement failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = (item) => item.quantity * item.productId.price;
  const calculateTotal = () =>
    cart.reduce((total, item) => total + calculateSubtotal(item), 0);

  const handleSelectAddress = (idx) => setSelectedAddressIndex(idx);

  const handleAddNewAddress = async () => {
    try {
      await dispatch(addUserAddress(newAddress));
      setNewAddressDialogOpen(false);
      setNewAddress({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        type: "home",
      });
      await dispatch(getUser()); // Refresh user data
      showSnackbar("Address added successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to add address. Please try again.", "error");
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case "home":
        return <HomeIcon color="primary" />;
      case "work":
        return <WorkIcon color="secondary" />;
      default:
        return <LocationIcon color="action" />;
    }
  };

  const cartItems = useMemo(
    () =>
      cart.map((item) => {
        const isEditing = editingItemId === item.productId._id;
        return (
          <motion.div
            key={item.productId._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: theme.shadows[1],
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[4],
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} md={2}>
                    <Avatar
                      variant="rounded"
                      src={item.productId.images?.[0]}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: theme.palette.grey[200],
                      }}
                    >
                      <ShoppingCartIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm={9} md={10}>
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {item.productId.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.productId.description.substring(0, 100)}...
                        </Typography>
                        <Box mt={1}>
                          <Chip
                            label={`₹${item.productId.price}`}
                            size="small"
                            sx={{ mr: 1 }}
                            color="primary"
                          />
                          {item.variant && (
                            <Chip
                              label={item.variant}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="h6" color="primary">
                          ₹{calculateSubtotal(item)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" mt={2}>
                      {isEditing ? (
                        <>
                          <TextField
                            type="number"
                            value={editedQuantity}
                            onChange={handleQuantityChange}
                            size="small"
                            sx={{ width: "80px", mr: 2 }}
                            inputProps={{ min: 1 }}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              handleUpdate(item.productId._id, editedQuantity)
                            }
                            sx={{ mr: 1 }}
                          >
                            Update
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setEditingItemId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Typography variant="body1" sx={{ mr: 2 }}>
                            Qty: <strong>{item.quantity}</strong>
                          </Typography>
                          <Tooltip title="Edit quantity">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleEditClick(
                                  item.productId._id,
                                  item.quantity
                                )
                              }
                              sx={{ mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Remove item">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item.productId._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        );
      }),
    [cart, editingItemId, editedQuantity, theme]
  );

  const total = useMemo(() => calculateTotal(), [cart]);

  const canProceed = useMemo(() => {
    if (activeStep === 0) return cart.length > 0;
    if (activeStep === 1) return user?.addresses?.length > 0;
    return true;
  }, [activeStep, cart, user]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={3} fontWeight={600}>
              {cart.length} {cart.length === 1 ? "Item" : "Items"} in Cart
            </Typography>
            {cartItems}
          </Paper>
        );
      case 1:
        return (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <ShippingIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" fontWeight={600}>
                Select Shipping Address
              </Typography>
            </Box>

            {user?.addresses?.length > 0 ? (
              <Grid container spacing={2}>
                {user.addresses.map((addr, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Card
                      onClick={() => handleSelectAddress(idx)}
                      sx={{
                        border:
                          selectedAddressIndex === idx
                            ? `2px solid ${theme.palette.primary.main}`
                            : "1px solid #e0e0e0",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          boxShadow: theme.shadows[2],
                        },
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      {selectedAddressIndex === idx && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: "50%",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircleIcon
                            sx={{ color: "white", fontSize: 20 }}
                          />
                        </Box>
                      )}
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Avatar sx={{ bgcolor: theme.palette.grey[100] }}>
                            {getAddressIcon(addr.type || "other")}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {addr.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {addr.phone}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" paragraph>
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {addr.country}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => setNewAddressDialogOpen(true)}
                    sx={{
                      border: "2px dashed #e0e0e0",
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 4 }}>
                      <AddLocationAltIcon
                        color="primary"
                        sx={{ fontSize: 40, mb: 1 }}
                      />
                      <Typography variant="subtitle1" color="primary">
                        Add New Address
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <AddLocationAltIcon
                  sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No Address Added
                </Typography>
                <Typography color="text.secondary" mb={3}>
                  Please add a shipping address to continue
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setNewAddressDialogOpen(true)}
                  startIcon={<AddLocationAltIcon />}
                >
                  Add New Address
                </Button>
              </Box>
            )}
          </Paper>
        );
      case 2:
        return (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <PaymentIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6" fontWeight={600}>
                Payment Information
              </Typography>
            </Box>

            <Box mb={4}>
              <Typography variant="subtitle1" mb={2}>
                Order Summary
              </Typography>

              <Box
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  p: 3,
                  borderRadius: 2,
                }}
              >
                {cart.map((item, idx) => (
                  <Box
                    key={idx}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography>
                      {item.productId.name} × {item.quantity}
                    </Typography>
                    <Typography>₹{calculateSubtotal(item)}</Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>Subtotal:</Typography>
                  <Typography fontWeight={600}>₹{total}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Shipping:</Typography>
                  <Typography color="success.main">FREE</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    ₹{total}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box mb={4}>
              <Typography variant="subtitle1" mb={2}>
                Shipping Address
              </Typography>
              {user?.addresses?.[selectedAddressIndex] && (
                <Card sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
                  <Typography fontWeight={600}>
                    {user.addresses[selectedAddressIndex].name}
                  </Typography>
                  <Typography variant="body2">
                    {user.addresses[selectedAddressIndex].addressLine1}
                    {user.addresses[selectedAddressIndex].addressLine2 &&
                      `, ${user.addresses[selectedAddressIndex].addressLine2}`}
                  </Typography>
                  <Typography variant="body2">
                    {user.addresses[selectedAddressIndex].city},{" "}
                    {user.addresses[selectedAddressIndex].state} -{" "}
                    {user.addresses[selectedAddressIndex].postalCode}
                  </Typography>
                  <Typography variant="body2">
                    {user.addresses[selectedAddressIndex].country}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    Phone: {user.addresses[selectedAddressIndex].phone}
                  </Typography>
                </Card>
              )}
            </Box>

            <Typography color="text.secondary" variant="body2">
              By placing your order, you agree to our Terms of Service and
              Privacy Policy.
            </Typography>
          </Paper>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton href="/products" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700}>
          Checkout
        </Typography>
        <Badge badgeContent={cart.length} color="primary" sx={{ ml: 2 }}>
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {loading && cart.length === 0 ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress size={60} />
        </Box>
      ) : cart.length > 0 ? (
        <>
          {renderStepContent(activeStep)}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={handleBackStep}
              disabled={activeStep === 0}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleOrder}
                disabled={!canProceed || loading}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Pay ₹${total}`
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNextStep}
                disabled={!canProceed}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Continue
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Box textAlign="center" my={8}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Looks like you haven't added any items to your cart yet
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              localStorage.setItem('buyerActiveTab', 0); // Set Home tab as active
              navigate('/home'); // Optionally navigate to home if you want
              window.location.reload();// Reload to refresh the page
            }}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Continue Shopping
          </Button>
        </Box>
      )}

      {/* New Address Dialog */}
      <Dialog
        open={newAddressDialogOpen}
        onClose={() => setNewAddressDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}
        >
          <Typography variant="h6" fontWeight={600}>
            Add New Address
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box display="flex" gap={2} mb={3}>
            {["home", "work", "other"].map((type) => (
              <Button
                key={type}
                variant={newAddress.type === type ? "contained" : "outlined"}
                startIcon={getAddressIcon(type)}
                onClick={() => setNewAddress({ ...newAddress, type })}
                sx={{
                  textTransform: "capitalize",
                  flex: 1,
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                {type}
              </Button>
            ))}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                fullWidth
                size="small"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                fullWidth
                size="small"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                fullWidth
                size="small"
                value={newAddress.addressLine1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine1: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address Line 2"
                fullWidth
                size="small"
                value={newAddress.addressLine2}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, addressLine2: e.target.value })
                }
                helperText="Apartment, suite, unit, building, floor, etc."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                fullWidth
                size="small"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="State"
                fullWidth
                size="small"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Postal Code"
                fullWidth
                size="small"
                value={newAddress.postalCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, postalCode: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                fullWidth
                size="small"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}
        >
          <Button
            onClick={() => setNewAddressDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 1, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddNewAddress}
            variant="contained"
            sx={{ borderRadius: 1, px: 4 }}
          >
            Save Address
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
