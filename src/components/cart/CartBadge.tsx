
import React from "react";

interface CartBadgeProps {
  itemCount: number;
}

const CartBadge = ({ itemCount }: CartBadgeProps) => {
  if (itemCount <= 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-khrate-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );
};

export default CartBadge;
