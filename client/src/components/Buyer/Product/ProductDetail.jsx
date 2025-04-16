import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Divider
} from '@mui/material';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

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
            boxShadow: 4
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
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
