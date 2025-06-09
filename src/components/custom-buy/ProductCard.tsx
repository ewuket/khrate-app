
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import GroupBuyButton from "@/components/group-buy/GroupBuyButton";
import { toast } from "sonner";

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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      unit: product.unit,
      type: 'product',
      image: product.image
    });
    
    toast.success(`${quantity} ${product.unit} of ${product.name} added to cart`);
    
    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-khrate-600">
              RWF {product.price.toLocaleString()}
            </span>
            <Badge variant="outline" className="text-xs">
              per {product.unit}
            </Badge>
          </div>
        </div>

        {product.inStock && (
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="font-medium text-center min-w-[3rem]">
                {quantity} {product.unit}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-khrate-500 hover:bg-khrate-600"
                size="sm"
              >
                Add to Cart
              </Button>
              
              <GroupBuyButton
                item={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                  type: 'product',
                  image: product.image
                }}
                variant="outline"
                size="sm"
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
