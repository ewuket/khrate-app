
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import CartBadge from "@/components/cart/CartBadge";

interface CartButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
}

const CartButton = ({ variant = "ghost", size = "icon", className = "" }: CartButtonProps) => {
  const { cart, openCart } = useCartContext();
  
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleCartClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Cart button clicked/touched, opening cart...');
    openCart();
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={`relative text-gray-700 hover:text-khrate-500 touch-manipulation active:scale-95 transition-all ${className}`}
      onClick={handleCartClick}
      onTouchEnd={handleCartClick}
      type="button"
      style={{ touchAction: 'manipulation' }}
    >
      <ShoppingCart className="h-5 w-5" />
      <CartBadge itemCount={totalQuantity} />
    </Button>
  );
};

export default CartButton;
