
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types/cart';
import { useCartOperations } from './useCartOperations';
import { useCartState } from './useCartState';
import { toast } from 'sonner';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const operations = useCartOperations();
  const { setAdding, isAdding, clearAdding } = useCartState();

  const syncCart = async () => {
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const formattedCart: CartItem[] = (data || []).map(item => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
          quantity: item.quantity,
          product_unit: item.product_unit || 'item',
          product_type: item.product_type as 'bundle' | 'custom' | 'group',
          product_items: Array.isArray(item.product_items) ? item.product_items as string[] : undefined
        }));

        setCart(formattedCart);
        console.log('Cart synced from Supabase:', formattedCart.length, 'items');
      } else {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        setCart(guestCart);
        console.log('Cart loaded from localStorage:', guestCart.length, 'items');
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      setCart([]);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncCart();
  }, [user, isAuthenticated]);

  const openCart = () => {
    console.log('Opening cart with', cart.length, 'items');
    setIsCartOpen(true);
  };
  
  const closeCart = () => setIsCartOpen(false);

  const getCartTotal = () => {
    const total = cart.reduce((total, item) => {
      const itemTotal = (item.product_price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
    console.log('Cart total calculated:', total, 'from', cart.length, 'items');
    return total;
  };

  const addToCart = async (item: any, type: 'bundle' | 'custom' | 'group' = 'bundle') => {
    const itemKey = `${item.id}-${type}`;
    
    if (isAdding(itemKey)) {
      console.log('Already adding this item, skipping duplicate request');
      return;
    }
    
    setAdding(itemKey, true);
    
    try {
      console.log('Adding item to cart:', item);
      
      // Add to backend first
      await operations.addToCart({
        ...item,
        type: type
      });
      
      // Then sync cart to get updated state
      await syncCart();
      
      // Open cart to show the added item
      setIsCartOpen(true);
      
      toast.success(`${item.name} added to cart!`);
      
    } catch (error) {
      console.error('Error in addToCart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      // Clear the adding state immediately to reset button
      setTimeout(() => {
        clearAdding(itemKey);
      }, 500);
    }
  };

  const isAddingToCart = (itemId: string | number, type: string = 'bundle') => {
    return isAdding(`${itemId}-${type}`);
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await operations.removeFromCart(itemId);
      await syncCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await operations.updateQuantity(itemId, quantity);
      await syncCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await operations.clearCart();
      await syncCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  return {
    cart,
    isCartOpen,
    loading,
    isAddingToCart,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    syncCart
  };
};
