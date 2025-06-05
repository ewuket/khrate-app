
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface BundleAddToCartButtonProps {
  onAddToCart: (e: React.MouseEvent) => void;
  isAdding: boolean;
  className?: string;
}

const BundleAddToCartButton: React.FC<BundleAddToCartButtonProps> = ({
  onAddToCart,
  isAdding,
  className = ""
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdding) {
      onAddToCart(e);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={isAdding}
      className={`bg-khrate-500 hover:bg-khrate-600 text-white font-medium py-2 px-4 transition-colors disabled:opacity-50 touch-manipulation active:scale-95 ${className}`}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
};

export default BundleAddToCartButton;
