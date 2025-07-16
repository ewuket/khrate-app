
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface BundleAddToCartButtonProps {
  onAddToCart: (e: React.MouseEvent) => void;
  isAdding: boolean;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
}

const BundleAddToCartButton: React.FC<BundleAddToCartButtonProps> = ({
  onAddToCart,
  isAdding,
  className = "",
  size = "default"
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
      size={size}
      className={`${
        isAdding 
          ? 'opacity-75 cursor-not-allowed bg-gray-400' 
          : 'bg-khrate-500 hover:bg-khrate-600'
      } text-white font-medium py-2 px-4 transition-all duration-200 min-h-[44px] ${className}`}
      style={{
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
};

export default BundleAddToCartButton;
