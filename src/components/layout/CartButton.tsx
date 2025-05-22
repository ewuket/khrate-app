
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
}

const CartButton = ({ variant = "ghost", size = "icon", className = "" }: CartButtonProps) => {
  const { cart, openCart } = useCart();
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={`relative text-gray-700 hover:text-khrate-500 ${className}`}
      onClick={openCart}
    >
      <ShoppingCart className="h-5 w-5" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-khrate-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </Button>
  );
};

export default CartButton;
