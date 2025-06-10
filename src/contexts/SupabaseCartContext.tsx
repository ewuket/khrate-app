
import React, { createContext, useContext, useState } from "react";
import { CartContextType } from "@/types/cart";
import { useCartSync } from "@/hooks/useCartSync";
import { useSecureCartOperations } from "@/hooks/useSecureCartOperations";
import { CartItem } from "@/types/cart";

const SupabaseCartContext = createContext<CartContextType | undefined>(undefined);

export const SupabaseCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { loading } = useCartSync();
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  } = useSecureCartOperations(cart, setCart, openCart);

  const syncCart = async (): Promise<void> => {
    // Implementation for syncing cart
  };

  const getCartCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isAddingToCart = (productId: number, productType = 'product'): boolean => {
    return false; // Simplified implementation
  };

  return (
    <SupabaseCartContext.Provider 
      value={{ 
        cart, 
        isCartOpen, 
        openCart, 
        closeCart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartTotal,
        getCartCount,
        syncCart,
        isAddingToCart
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
