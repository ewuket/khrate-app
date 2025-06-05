
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types/cart';
import { useCartOperations } from './useCartOperations';
import { toast } from 'sonner';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const operations = useCartOperations();

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
      } else {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        setCart(guestCart);
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

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  const addToCart = async (item: any, skipCartOpen: boolean = false) => {
    if (isAddingToCart) {
      console.log('Already adding to cart, skipping...');
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      console.log('Adding item to cart:', item);
      await operations.addToCart(item);
      
      // Force immediate cart sync
      await syncCart();
      
      // Show success message
      toast.success(`${item.name || item.title} added to cart!`);
      
      // Only open cart if not explicitly skipped
      if (!skipCartOpen) {
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
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
