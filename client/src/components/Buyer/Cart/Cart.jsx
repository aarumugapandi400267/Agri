import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { fetchCartFromDB, saveCartToDB } from "../../../api/cartAPI"; // Import API utility

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Merge cart from localStorage and database
  const mergeCarts = (localCart, dbCart) => {
    const mergedCart = [...dbCart];

    localCart.forEach((localItem) => {
      const existingItem = mergedCart.find((dbItem) => dbItem.productId === localItem.productId);

      if (existingItem) {
        // Update quantity if the item exists in both carts
        existingItem.quantity += localItem.quantity;
      } else {
        // Add the item if it doesn't exist in the database cart
        mergedCart.push(localItem);
      }
    });

    return mergedCart;
  };

  // Fetch and merge carts
  const syncCart = async () => {
    try {
      setLoading(true);

      // Fetch cart from the database
      const dbCart = await fetchCartFromDB();

      // Get cart from localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Merge the carts
      const mergedCart = mergeCarts(localCart, dbCart);

      // Save the merged cart to the database
      await saveCartToDB(mergedCart);

      // Update the state and localStorage
      setCart(mergedCart);
      localStorage.setItem("cart", JSON.stringify(mergedCart));
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    await saveCartToDB(updatedCart);
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" textAlign="center">
        Your Cart
      </Typography>
      {loading ? (
        <Typography textAlign="center" mt={2}>
          Loading...
        </Typography>
      ) : cart.length === 0 ? (
        <Typography textAlign="center" mt={2}>
          Your cart is empty.
        </Typography>
      ) : (
        <Grid container spacing={2} mt={2}>
          {cart.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.productId}>
              <Card>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="150"
                    image={item.image}
                    alt={item.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">Price: ₹{item.price}</Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveItem(item.productId)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}