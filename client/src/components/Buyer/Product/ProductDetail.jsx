import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Divider,
  Button,
  TextField,
  Tooltip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1); // Quantity state

  useEffect(() => {
    if (!product) {
      axios.get(`/api/products/${id}`)
        .then(res => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, product]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product?.stock || 1, parseInt(e.target.value) || 1)); // Ensure quantity is between 1 and stock
    setQuantity(value);
  };

  const addToCart = () => {
    console.log(`Adding product ${id} with quantity ${quantity} to cart.`);
    // Add logic to update the cart
  };

  const orderNow = () => {
    console.log(`Ordering product ${id} with quantity ${quantity}.`);
    // Add logic to place the order
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading product details...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">Product not found.</Typography>
      </Container>
    );
  }

  const { name, description, price, stock, farmer, image } = product;
  const imageUrl = `data:${image?.contentType};base64,${image?.data}`;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px) brightness(0.6)',
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth="md" sx={{ pt: 6, pb: 8 }}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            p: 3,
            gap: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: 3,
            boxShadow: 4,
            alignItems: 'center',
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: { xs: '100%', md: 350 },
              height: { xs: 250, md: 350 },
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: 2
            }}
            image={imageUrl}
            alt={name}
          />

          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" color="primary.dark">
              {name}
            </Typography>
            <Divider sx={{ my: 1 }} />

            <Typography variant="body1" color="text.secondary">
              {description || "No description available."}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
              Price: ₹{price}/kg
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Vendor: {farmer}
            </Typography>

            <Box mt={3} textAlign="center">
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                label="Quantity"
                size="small"
                variant="outlined"
                inputProps={{
                  min: 1,
                  max: stock,
                }}
                sx={{ width: '80px', mr: 2 }}
              />
              <Tooltip title="Add to Cart">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addToCart}
                  disabled={stock <= 0}
                >
                  <ShoppingCartIcon />
                </Button>
              </Tooltip>

              <Tooltip title="Order Now">
                <Button
                  variant="contained"
                  color="success"
                  onClick={orderNow}
                  disabled={stock <= 0}
                  sx={{ ml: 2 }}
                >
                  <ShoppingBagIcon />
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}