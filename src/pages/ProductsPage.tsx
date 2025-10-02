import React from 'react';
import ProductsHero from '../components/products/ProductsHero';
import ProductsGrid from '../components/products/ProductsGrid';

const ProductsPage: React.FC = () => {
  return (
    <>
      <ProductsHero />
      <ProductsGrid />
    </>
  );
};

export default ProductsPage;
