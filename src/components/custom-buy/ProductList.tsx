
import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  inStock: boolean;
  description?: string;
}

interface ProductListProps {
  products: Array<{
    id: number;
    name: string;
    price: number;
    unit: string;
    category: string;
    image: string;
    description?: string;
  }>;
  onAddToCart: (product: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  // Convert products to include inStock property
  const productsWithStock: Product[] = products.map(product => ({
    ...product,
    inStock: true // Default to in stock for now
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productsWithStock.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
