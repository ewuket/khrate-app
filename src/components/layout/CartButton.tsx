
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
    console.log('Cart button clicked, opening cart with', cart.length, 'items');
    openCart();
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={`relative hover:bg-accent hover:text-accent-foreground touch-manipulation active:scale-95 transition-all select-none min-h-[44px] min-w-[44px] ${className}`}
      onClick={handleCartClick}
      onTouchStart={handleCartClick}
      type="button"
      style={{ 
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <ShoppingCart className="h-5 w-5" />
      <CartBadge itemCount={totalQuantity} />
    </Button>
  );
};

export default CartButton;
