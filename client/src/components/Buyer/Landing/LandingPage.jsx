import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../../actions/customer/user';
import ProductCard from '../Product/ProductCard';
import {
  Grid,
  Container,
  Typography,
  TextField,
  Box,
  InputAdornment,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts())
      .then(result => setProducts(result))
      .catch(error => console.log(error));
  }, [dispatch]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 6, pb: 4 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="primary"
        >
          Explore Products
        </Typography>

        {/* Styled Search Bar */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for fresh produce, grains, etc..."
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              mx: 1,
              fontSize: '1.1rem',
              input: {
                p: 1,
              },
            }}
          />
        </Paper>
      </Box>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {filteredProducts.map((product, idx) => (
          <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid> 
    </Container>
  );
}
 