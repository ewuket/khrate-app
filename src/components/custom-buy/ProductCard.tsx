
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = async () => {
    try {
      console.log('Adding product to custom cart:', product);
      
      onAddToCart(product);
      
      toast.success(`${product.name} added to cart`, {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="aspect-[4/3] sm:aspect-square">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3 sm:p-4 flex flex-col h-full">
        <h3 className="font-semibold text-sm sm:text-lg mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-orange-500 font-bold text-lg sm:text-xl mb-3">
          {product.price.toLocaleString()} RWF
          <span className="text-xs sm:text-sm text-gray-500 ml-1">per {product.unit}</span>
        </p>
        
        <div className="mt-auto">
          <Button 
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-sm sm:text-base h-9 sm:h-10"
            onClick={handleAddToCart}
          >
            <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
