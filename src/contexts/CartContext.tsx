
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartData = useCart();

  return (
    <CartContext.Provider value={cartData}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
