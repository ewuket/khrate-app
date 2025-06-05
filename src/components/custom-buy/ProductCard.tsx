
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      await onAddToCart(product, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-khrate-300 bg-white overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-khrate-500 text-white font-medium px-2 py-1 text-xs">
            {product.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </CardTitle>
        </div>
        <div className="space-y-2">
          <div className="text-xl font-bold text-khrate-600">
            {formatPrice(product.price)} / {product.unit}
          </div>
          {product.description && (
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 mt-auto">
        <div className="space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={incrementQuantity}
              disabled={quantity >= 99}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white font-medium py-2 transition-colors"
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
