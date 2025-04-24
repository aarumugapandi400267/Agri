import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { getCart } from '../../../actions/customer/cart'; // Assuming these actions exist
import { useDispatch } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await dispatch(getCart());
        setCart(response.items || []); // Ensure response.items is valid
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };
    fetchCart();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      // await dispatch(deleteCartItem(id)); // Assuming deleteCartItem is an action
      setCart(cart.filter((item) => item._id !== id)); // Remove the item from the state
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleUpdate = async (id, quantity) => {
    try {
      // const updatedItem = await dispatch(updateCartItem(id, { quantity })); // Assuming updateCartItem is an action
      setCart(cart.map((item) => (item._id === id ? { ...item, quantity: updatedItem.quantity } : item))); // Update the state
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleQuantityChange = (id, change) => {
    const item = cart.find((item) => item._id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        handleUpdate(id, newQuantity);
      }
    }
  };

  return (
    <>
      <Box mt={4}>
        <Typography variant="h5" textAlign="center">Your Cart</Typography>
        <Box mt={2}>
          {cart.length > 0 ? (
            cart.map((item) => (
              <Box key={item._id} p={2} border="1px solid #ccc" borderRadius="8px" mb={2}>
                <Typography variant="h6">{item.productId.name}</Typography>
                <Typography>Description: {item.productId.description}</Typography>
                <Typography>Quantity: {item.quantity}</Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleQuantityChange(item._id, 1)}
                  >
                    +
                  </Button>
                  <Typography mx={2}>{item.quantity}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleQuantityChange(item._id, -1)}
                  >
                    -
                  </Button>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleUpdate(item._id, item.quantity)}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography textAlign="center">Your cart is empty.</Typography>
          )}
        </Box>
      </Box>
    </>
  );
}