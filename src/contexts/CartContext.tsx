
import React, { createContext, useContext } from 'react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types/cart';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  loading: boolean;
  isAddingToCart: (itemId: string | number, type?: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: any, skipCartOpen?: boolean) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Create fallback context value
const createFallbackContext = (): CartContextType => ({
  cart: [],
  isCartOpen: false,
  loading: false,
  isAddingToCart: () => false,
  openCart: () => console.warn('Cart context not available'),
  closeCart: () => console.warn('Cart context not available'),
  addToCart: async () => console.warn('Cart context not available'),
  removeFromCart: async () => console.warn('Cart context not available'),
  updateQuantity: async () => console.warn('Cart context not available'),
  clearCart: async () => console.warn('Cart context not available'),
  getCartTotal: () => 0,
  syncCart: async () => console.warn('Cart context not available')
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let cartData;
  
  try {
    cartData = useCart();
  } catch (error) {
    console.error('Error initializing cart context:', error);
    cartData = null;
  }

  // Provide fallback context if cartData is not available
  const contextValue = cartData || createFallbackContext();

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error('useCartContext must be used within a CartProvider');
    // Return fallback instead of throwing
    return createFallbackContext();
  }
  return context;
};
