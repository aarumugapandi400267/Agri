import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Divider, TextField } from '@mui/material';
import { getCart, deleteCartItem,updateCartItem } from '../../../actions/customer/cart'; // Assuming these actions exist
import { useDispatch } from 'react-redux';

export default function Cart() {
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]); // Local state for cart items
  const [loading, setLoading] = useState(false); // Loading state
  const [editingItemId, setEditingItemId] = useState(null); // Track which item's quantity is being edited
  const [editedQuantity, setEditedQuantity] = useState(0); // Track the edited quantity

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
      fetchCart(); // Refetch the cart after deletion
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
  const handleOrder = () => {
    console.log('Order placed:', cart);
    // Add logic to handle order placement
  };

  // Calculate subtotal and total
  const calculateSubtotal = (item) => item.quantity * item.productId.price;
  const calculateTotal = () => cart.reduce((total, item) => total + calculateSubtotal(item), 0);

  return (
    <>
      <Box mt={4}>
        <Typography variant="h5" textAlign="center">Your Cart</Typography>
        <Box mt={2}>
          {loading ? (
            <Typography textAlign="center">Loading cart...</Typography>
          ) : cart.length > 0 ? (
            <>
              {cart.map((item,idx) => {
                const isEditing = editingItemId === item.productId; // Check if this item is being edited

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
              })}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" textAlign="right">
                Total: ₹{calculateTotal()}
              </Typography>
            </>
          ) : (
            <Typography textAlign="center">Your cart is empty.</Typography>
          )}
        </Box>
        {/* Order Button */}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrder}
            disabled={cart.length === 0} // Disable if cart is empty
          >
            Proceed to Order
          </Button>
        </Box>
      </Box>
    </>
  );
}