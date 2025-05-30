/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, Divider, TextField, CircularProgress,
  Card, CardContent, CardActions, Grid, Collapse, IconButton
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getCart, deleteCartItem, updateCartItem, clearCart } from '../../../actions/customer/cart';
import { placeOrder } from '../../../actions/customer/order';
import { verifyPayment } from '../../../actions/customer/order'; // <-- You need to implement this action
import { useDispatch, useSelector } from 'react-redux';
import AddressSelector from './AddressSelector'; // adjust path if needed
import { addUserAddress } from '../../../actions/customer/user'; // <-- Import the action

export default function Cart() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.authenticationReducer.AuthData._doc); // adjust to your store
  console.log(user);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(user?.defaultAddressIndex || 0);
  const [addresses, setAddresses] = useState(user?.addresses || []);

  // Function to fetch the cart
  const fetchCart = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await dispatch(getCart());
      setCart(response.items || []); // Update cart with fetched items
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch the cart when the component mounts
  useEffect(() => {
    fetchCart();
  }, [dispatch]);

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCartItem(id)); // Assuming deleteCartItem is an action
      // fetchCart(); // Refetch the cart after deletion
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  // Handle update operation
  const handleUpdate = async (id, quantity) => {
    try {
      // Assuming updateCartItem is an action
      await dispatch(updateCartItem(id, quantity));
      fetchCart(); // Refetch the cart after update
      setEditingItemId(null); // Exit edit mode
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  // Handle edit button click
  const handleEditClick = (id, currentQuantity) => {
    setEditingItemId(id); // Set the item to edit mode
    setEditedQuantity(currentQuantity); // Set the current quantity as the initial value
  };

  // Handle quantity change in the text field
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure quantity is at least 1
    setEditedQuantity(value);
  };

  // Handle order button click
  const handleOrder = async () => {
    setLoading(true);
    try {
      let shippingAddress;
      if (showNewAddress) {
        shippingAddress = newAddress;
        // Optionally, save new address to user profile here
      } else {
        // Add a check here
        if (!user || !user.addresses || user.addresses.length === 0) {
          alert("Please add or select a shipping address.");
          setLoading(false);
          return;
        }
        shippingAddress = user.addresses[selectedAddressIndex];
      }

      // Prepare order data as expected by your backend
      const orderData = {
        products: cart.map(item => ({
          product: item.productId._id,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress, // <-- include address here
      };

      // Call backend to create order and get payment info
      const response = await dispatch(placeOrder(orderData));

      // Option B: Open Razorpay Checkout directly
      if (response.razorpayOrderId && response.key) {
        const options = {
          key: response.key,
          amount: response.amount,
          currency: response.currency,
          order_id: response.razorpayOrderId,
          name: "Agri Marketplace",
          description: "Order Payment",
          handler: async function (paymentResponse) {
            // Call backend to verify payment
            try {
              setLoading(true);
              await dispatch(verifyPayment({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }));
              alert("Payment successful!");
              await dispatch(clearCart());
              fetchCart();
            } catch (err) {
              alert("Payment verification failed. Please contact support.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: response.user?.name,
            email: response.user?.email,
          },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: function () {
              setLoading(false);
              alert("Payment cancelled.");
            }
          } 
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Order placed successfully!");
        await dispatch(clearCart());
        fetchCart();
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Order placement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal and total
  const calculateSubtotal = (item) => item.quantity * item.productId.price;
  const calculateTotal = () => cart.reduce((total, item) => total + calculateSubtotal(item), 0);

  // Address selection UI
  const renderAddresses = () => (
    <Box mb={2}>
      <Typography variant="h6" mb={1}>Shipping Address</Typography>
      <Grid container spacing={2}>
        {user?.addresses?.map((addr, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card
              variant={selectedAddressIndex === idx && !showNewAddress ? "outlined" : "elevation"}
              sx={{
                borderColor: selectedAddressIndex === idx && !showNewAddress ? "primary.main" : "grey.300",
                boxShadow: selectedAddressIndex === idx && !showNewAddress ? 2 : 0,
                position: "relative"
              }}
              onClick={() => {
                setSelectedAddressIndex(idx);
                setShowNewAddress(false);
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  {selectedAddressIndex === idx && !showNewAddress && (
                    <CheckCircleIcon color="primary" fontSize="small" />
                  )}
                  <Typography fontWeight={600}>{addr.name}</Typography>
                  <Typography variant="body2" color="text.secondary">({addr.phone})</Typography>
                </Box>
                <Typography variant="body2">
                  {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ", "}
                  {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <Card
            variant={showNewAddress ? "outlined" : "elevation"}
            sx={{
              borderColor: showNewAddress ? "primary.main" : "grey.300",
              boxShadow: showNewAddress ? 2 : 0,
              cursor: "pointer",
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setShowNewAddress(true)}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <AddLocationAltIcon color="primary" />
              <Typography>Add New Address</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Collapse in={showNewAddress}>
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <TextField label="Name" size="small" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
          <TextField label="Phone" size="small" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
          <TextField label="Address Line 1" size="small" value={newAddress.addressLine1} onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
          <TextField label="Address Line 2" size="small" value={newAddress.addressLine2} onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
          <TextField label="City" size="small" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
          <TextField label="State" size="small" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
          <TextField label="Postal Code" size="small" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
          <TextField label="Country" size="small" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} />
          <Box display="flex" gap={1} mt={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowNewAddress(false);
                setSelectedAddressIndex(-1); // Use new address
              }}
            >
              Use this address
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowNewAddress(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );

  const cartItems = useMemo(() => cart.map((item, idx) => {
    const isEditing = editingItemId === item.productId;
    return (
      <Box key={idx} p={2} border="1px solid #ccc" borderRadius="8px" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box flex={1}>
            <Typography variant="h6">{item.productId.name}</Typography>
            <Typography>Description: {item.productId.description}</Typography>
            <Typography>Unit Price: ₹{item.productId.price}</Typography>
            <Typography>Subtotal: ₹{calculateSubtotal(item)}</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          {isEditing ? (
            <>
              <TextField
                type="number"
                value={editedQuantity}
                onChange={handleQuantityChange}
                size="small"
                sx={{ width: '80px', mr: 2 }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={() => handleUpdate(item.productId._id, editedQuantity)}
              >
                Update
              </Button>
            </>
          ) : (
            <>
              <Typography mx={2}>Quantity: {item.quantity}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEditClick(item.productId, item.quantity)}
              >
                Edit
              </Button>
            </>
          )}
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(item.productId)}
          >
            Delete
          </Button>
        </Box>
      </Box>
    );
  }), [cart, editingItemId, editedQuantity]);

  const total = useMemo(() => calculateTotal(), [cart]);

  const canOrder = useMemo(() => {
    if (cart.length === 0 || loading) return false;
    if (showNewAddress) {
      return Object.values(newAddress).every(val => val && val.trim() !== "");
    }
    return user && user.addresses && user.addresses.length > 0;
  }, [cart, loading, showNewAddress, newAddress, user]);

  // Memoize address rendering
  const memoizedAddresses = useMemo(() => renderAddresses(), [
    user, selectedAddressIndex, showNewAddress, newAddress
  ]);

  const handleSelectAddress = (idx) => setSelectedAddressIndex(idx);

  const handleAddAddress = async (address) => {
    // Optionally show loading state here
    try {
      // Call backend to save address and update user in Redux
      await dispatch(addUserAddress(address));
      // After Redux updates, addresses will be refreshed from user state
      // Optionally, setSelectedAddressIndex to the new address
      setSelectedAddressIndex(addresses.length); // select the new address
      setShowNewAddress(false);
    } catch (error) {
      alert("Failed to add address. Please try again.");
    }
  };

  return (
    <>
      <Box mt={4}>
        <Typography variant="h5" textAlign="center">Your Cart</Typography>
        <Box mt={2}>
          {loading ? (
            <Box textAlign="center"><CircularProgress /></Box>
          ) : cart.length > 0 ? (
            <>
              {cartItems}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" textAlign="right">
                Total: ₹{total}
              </Typography>
            </>
          ) : (
            <Typography textAlign="center">Your cart is empty.</Typography>
          )}
        </Box>
        {/* Address selection UI */}
        {user && (
          <AddressSelector
            addresses={addresses}
            selectedIndex={selectedAddressIndex}
            onSelect={handleSelectAddress}
            onAddAddress={handleAddAddress}
          />
        )}
        {/* Order Button */}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrder}
            disabled={!canOrder}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Proceed to Order"}
          </Button>
        </Box>
      </Box>
    </>
  );
}