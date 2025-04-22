import React from 'react';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

export default function ProductList({ products }) {
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      {products.map((product, idx) => (
        <Grid item key={idx} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
