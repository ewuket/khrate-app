
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCartOperations } from '@/hooks/useCartOperations';
import { useCartState } from '@/hooks/useCartState';
import { useCartSync } from '@/hooks/useCartSync';
import { CartItem } from '@/types/cart';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: any, skipCartOpen?: boolean) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  syncCart: () => Promise<void>;
  isAddingToCart: (productId: number, productType?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart, setCart, isCartOpen, setIsCartOpen, isAdding, setAdding, clearAdding } = useCartState();
  const operations = useCartOperations();
  const { syncCart: performSync } = useCartSync();

  // Sync cart when user changes or app loads
  useEffect(() => {
    if (isAuthenticated && user) {
      performSync().then((syncedCart) => {
        setCart(syncedCart);
        console.log('Cart synced for authenticated user');
      });
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem('khrate_guest_cart');
      if (guestCart) {
        try {
          setCart(JSON.parse(guestCart));
        } catch (error) {
          console.error('Error parsing guest cart:', error);
        }
      }
    }
  }, [user, isAuthenticated, setCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (item: any, skipCartOpen = false): Promise<void> => {
    const itemKey = `${item.id}_${item.type || 'product'}`;
    
    if (isAdding(itemKey)) {
      console.log('Item already being added, skipping:', itemKey);
      return;
    }

    try {
      setAdding(itemKey, true);
      
      await operations.addToCart(item);

      // Sync cart after adding
      if (isAuthenticated && user) {
        const syncedCart = await performSync();
        setCart(syncedCart);
      }

      // Auto-open cart unless explicitly skipped
      if (!skipCartOpen) {
        setTimeout(() => {
          openCart();
        }, 100);
      }
    } finally {
      clearAdding(itemKey);
    }
  };

  const removeFromCart = async (id: string): Promise<void> => {
    await operations.removeFromCart(id);
    if (isAuthenticated && user) {
      const syncedCart = await performSync();
      setCart(syncedCart);
    }
  };

  const updateQuantity = async (id: string, quantity: number): Promise<void> => {
    await operations.updateQuantity(id, quantity);
    if (isAuthenticated && user) {
      const syncedCart = await performSync();
      setCart(syncedCart);
    }
  };

  const clearCart = async (): Promise<void> => {
    await operations.clearCart();
    if (isAuthenticated && user) {
      const syncedCart = await performSync();
      setCart(syncedCart);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const syncCart = async (): Promise<void> => {
    if (isAuthenticated && user) {
      const syncedCart = await performSync();
      setCart(syncedCart);
    }
  };

  const isAddingToCart = (productId: number, productType = 'product'): boolean => {
    const itemKey = `${productId}_${productType}`;
    return isAdding(itemKey);
  };

  const contextValue: CartContextType = {
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
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
