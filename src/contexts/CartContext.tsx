
import React, { createContext, useContext } from "react";
import { CartContextType } from "@/types/cart";
import { useCart } from "@/hooks/useCart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartOperations = useCart();

  return (
    <CartContext.Provider value={cartOperations}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
