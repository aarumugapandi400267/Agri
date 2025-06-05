/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Tooltip,
  Chip,
  Rating,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReplayIcon from '@mui/icons-material/Replay';
import axios from 'axios';
import { addCartItem } from '../../../actions/customer/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!product) {
      axios.get(`/api/products/${id}`)
        .then(res => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load product details');
          setLoading(false);
        });
    }
  }, [id, product]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product?.stock || 1, parseInt(e.target.value) || 1));
    setQuantity(value);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(product?.stock || 1, prev + 1));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const addToCart = (e) => {
    console.log(`Adding product ${id} with quantity ${quantity} to cart.`);
    // Add logic to update the cart
    e.stopPropagation();
    dispatch(addCartItem(id, quantity));
  };

  const orderNow = (e) => {
    console.log(`Ordering product ${id} with quantity ${quantity}.`);
    // Add logic to place the order
  };

  const reloadProduct = () => {
    setLoading(true);
    setError(null);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load product details');
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={3} color="text.secondary">
          Loading product details...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        textAlign: 'center'
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Product not found'}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ReplayIcon />} 
          onClick={reloadProduct}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  const { name, description, price, stock, farmer, image, rating, reviews } = product;
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
          filter: 'blur(8px) brightness(0.7)',
          zIndex: -1,
          transform: 'scale(1.02)' // Prevents white edges from blur
        }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 2, color: 'white', backgroundColor: 'rgba(0,0,0,0.2)' }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>

        <Card
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            p: 4,
            gap: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Image Section */}
          <Box sx={{
            width: { xs: '100%', md: '40%' },
            minWidth: { xs: '100%', md: 400 },
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}>
            <CardMedia
              component="img"
              sx={{
                width: '100%',
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }}
              image={imageUrl}
              alt={name}
            />
            {stock <= 0 && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Chip 
                  label="Out of Stock" 
                  color="error" 
                  size="large"
                  sx={{ 
                    fontSize: '1.2rem', 
                    padding: 2,
                    backdropFilter: 'blur(4px)'
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Product Info Section */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            py: 1
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {name}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Rating 
                value={rating || 4.5} 
                precision={0.5} 
                readOnly 
                size="large" 
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({reviews || 24} reviews)
              </Typography>
            </Box>

            <Typography variant="h4" color="primary" fontWeight="bold" my={2}>
              ₹{price} <Typography component="span" variant="body1" color="text.secondary">/ kg</Typography>
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.7,
              mb: 3
            }}>
              {description || "No description available."}
            </Typography>

            {/* Vendor Info */}
            <Paper elevation={0} sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              borderRadius: 2
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Vendor Information
              </Typography>
              <Box display="flex" alignItems="center">
                <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                <Typography>
                  Sold by: <strong>{farmer}</strong>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={1}>
                <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                <Typography>
                  Free delivery on orders over ₹500
                </Typography>
              </Box>
            </Paper>

            {/* Quantity and Actions */}
            <Grid container spacing={2} alignItems="center" mt="auto">
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" mr={2}>
                    Quantity:
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <IconButton 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      sx={{ 
                        border: '1px solid #ddd',
                        borderRadius: '4px 0 0 4px'
                      }}
                    >
                      -
                    </IconButton>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      size="small"
                      variant="outlined"
                      inputProps={{
                        min: 1,
                        max: stock,
                        style: { 
                          textAlign: 'center',
                          width: '60px'
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          '& fieldset': {
                            borderLeft: 'none',
                            borderRight: 'none'
                          }
                        }
                      }}
                    />
                    <IconButton 
                      onClick={incrementQuantity}
                      disabled={quantity >= stock}
                      sx={{ 
                        border: '1px solid #ddd',
                        borderRadius: '0 4px 4px 0'
                      }}
                    >
                      +
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" ml={2}>
                    {stock} available
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                  <Tooltip title="Add to Cart">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addToCart}
                      disabled={stock <= 0}
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        mr: 2,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Tooltip>

                  <Tooltip title="Buy Now">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={orderNow}
                      disabled={stock <= 0}
                      startIcon={<ShoppingBagIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      Buy Now
                    </Button>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}