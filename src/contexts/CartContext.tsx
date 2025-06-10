
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCartOperations } from '@/hooks/useCartOperations';
import { useCartState } from '@/hooks/useCartState';
import { useCartSync } from '@/hooks/useCartSync';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';

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

  // Load cart on mount and when auth state changes
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        // Load authenticated user cart
        const syncedCart = await performSync();
        setCart(syncedCart);
        console.log('Cart synced for authenticated user:', syncedCart.length, 'items');
      } else {
        // Load guest cart from localStorage
        const guestCart = localStorage.getItem('khrate_guest_cart');
        if (guestCart) {
          try {
            const parsedCart = JSON.parse(guestCart);
            setCart(parsedCart);
            console.log('Guest cart loaded:', parsedCart.length, 'items');
          } catch (error) {
            console.error('Error parsing guest cart:', error);
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    };

    loadCart();
  }, [user, isAuthenticated, setCart]);

  const openCart = () => {
    console.log('Opening cart with', cart.length, 'items');
    setIsCartOpen(true);
  };
  
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (item: any, skipCartOpen = false): Promise<void> => {
    const itemKey = `${item.id}_${item.type || 'product'}`;
    
    if (isAdding(itemKey)) {
      console.log('Item already being added, skipping:', itemKey);
      return;
    }

    try {
      setAdding(itemKey, true);
      console.log('Adding item to cart:', item);

      // For guest users, add to localStorage immediately
      if (!isAuthenticated) {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const existingItemIndex = guestCart.findIndex((cartItem: any) => 
          cartItem.product_id === item.id && cartItem.product_type === (item.type || 'bundle')
        );

        if (existingItemIndex >= 0) {
          guestCart[existingItemIndex].quantity += 1;
          toast.success(`${item.name} quantity updated in cart!`);
        } else {
          const newCartItem = {
            id: `guest-${Date.now()}-${item.id}`,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: 1,
            product_unit: item.unit || 'item',
            product_type: item.type || 'bundle',
            product_items: item.items
          };
          guestCart.push(newCartItem);
          toast.success(`${item.name} added to cart!`);
        }

        localStorage.setItem('khrate_guest_cart', JSON.stringify(guestCart));
        setCart(guestCart);

        // Auto-open cart
        if (!skipCartOpen) {
          setTimeout(() => {
            openCart();
          }, 100);
        }
        return;
      }

      // For authenticated users, use operations
      await operations.addToCart(item);
      const syncedCart = await performSync();
      setCart(syncedCart);

      // Auto-open cart
      if (!skipCartOpen) {
        setTimeout(() => {
          openCart();
        }, 100);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      clearAdding(itemKey);
    }
  };

  const removeFromCart = async (id: string): Promise<void> => {
    try {
      if (!isAuthenticated) {
        // Handle guest cart
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const filteredCart = guestCart.filter((item: any) => item.id !== id);
        localStorage.setItem('khrate_guest_cart', JSON.stringify(filteredCart));
        setCart(filteredCart);
        toast.success('Item removed from cart');
        return;
      }

      await operations.removeFromCart(id);
      const syncedCart = await performSync();
      setCart(syncedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (id: string, quantity: number): Promise<void> => {
    try {
      if (!isAuthenticated) {
        // Handle guest cart
        if (quantity <= 0) {
          await removeFromCart(id);
          return;
        }

        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const itemIndex = guestCart.findIndex((item: any) => item.id === id);
        if (itemIndex >= 0) {
          guestCart[itemIndex].quantity = quantity;
          localStorage.setItem('khrate_guest_cart', JSON.stringify(guestCart));
          setCart(guestCart);
        }
        return;
      }

      await operations.updateQuantity(id, quantity);
      const syncedCart = await performSync();
      setCart(syncedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async (): Promise<void> => {
    try {
      if (!isAuthenticated) {
        // Handle guest cart
        localStorage.removeItem('khrate_guest_cart');
        setCart([]);
        toast.success('Cart cleared');
        return;
      }

      await operations.clearCart();
      const syncedCart = await performSync();
      setCart(syncedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
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
