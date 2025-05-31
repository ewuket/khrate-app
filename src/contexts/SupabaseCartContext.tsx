
import React, { createContext, useContext, useState } from "react";
import { CartContextType } from "@/types/cart";
import { useCartSync } from "@/hooks/useCartSync";
import { useSecureCartOperations } from "@/hooks/useSecureCartOperations";

const SupabaseCartContext = createContext<CartContextType | undefined>(undefined);

export const SupabaseCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, setCart, loading, syncCart } = useCartSync();
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  } = useSecureCartOperations(cart, setCart, openCart);

  return (
    <SupabaseCartContext.Provider 
      value={{ 
        cart, 
        isCartOpen, 
        loading,
        openCart, 
        closeCart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartTotal,
        syncCart
      }}
    >
      {children}
    </SupabaseCartContext.Provider>
  );
};

export const useSupabaseCart = () => {
  const context = useContext(SupabaseCartContext);
  if (context === undefined) {
    throw new Error('useSupabaseCart must be used within a SupabaseCartProvider');
  }
  return context;
};
