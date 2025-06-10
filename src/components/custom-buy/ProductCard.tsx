
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isAdding }) => {
  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdding) {
      onAddToCart(product);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white border">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-khrate-600">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-gray-500">
              per {product.unit}
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white font-medium py-2 px-4 transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
