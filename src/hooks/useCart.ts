
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types/cart';
import { useCartOperations } from './useCartOperations';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const operations = useCartOperations();

  const syncCart = async () => {
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        // Fetch from Supabase
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
        // Fetch from localStorage for guests
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        setCart(guestCart);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      setCart([]);
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
    console.log('Adding to cart with skipCartOpen:', skipCartOpen);
    try {
      await operations.addToCart(item);
      await syncCart(); // Refresh cart after adding
      
      // Only open cart if not explicitly skipped (for custom buy page)
      if (!skipCartOpen) {
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  const removeFromCart = async (itemId: string) => {
    await operations.removeFromCart(itemId);
    await syncCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await operations.updateQuantity(itemId, quantity);
    await syncCart();
  };

  const clearCart = async () => {
    await operations.clearCart();
    await syncCart();
  };

  return {
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
  };
};
