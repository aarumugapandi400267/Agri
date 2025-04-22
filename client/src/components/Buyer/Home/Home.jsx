import React from 'react';
import ProductList from '../Product/ProductList';

export default function HomePage({ products }) {
  return <ProductList products={products} />;
}
