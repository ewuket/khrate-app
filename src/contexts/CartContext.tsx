
import React, { createContext, useContext } from "react";
import { CartContextType } from "@/types/cart";
import { useCart } from "@/hooks/useCart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartOperations = useCart();
  
  const getCartCount = () => {
    return cartOperations.cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Wrap addToCart to match the expected signature
  const addToCartWithType = async (item: any, type: 'bundle' | 'custom' | 'group' = 'bundle') => {
    await cartOperations.addToCart(item, false); // Always open cart by default
  };

  return (
    <CartContext.Provider value={{
      ...cartOperations,
      addToCart: addToCartWithType,
      getCartCount
    }}>
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
