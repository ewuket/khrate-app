
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useCartOperations = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const addToCart = useCallback(async (item: any) => {
    console.log('Adding item to cart:', item);
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        // Check if item already exists in cart
        const { data: existingItems, error: checkError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', item.id);

        if (checkError) throw checkError;

        if (existingItems && existingItems.length > 0) {
          // Update quantity if item exists
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItems[0].quantity + 1 })
            .eq('id', existingItems[0].id);

          if (error) throw error;
          console.log('Item quantity updated in cart');
        } else {
          // Add new item to cart
          const cartItem = {
            user_id: user.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_unit: item.unit || 'item',
            product_type: item.type || 'bundle',
            quantity: 1,
            product_items: item.items ? JSON.stringify(item.items) : null
          };

          const { error } = await supabase
            .from('cart_items')
            .insert(cartItem);

          if (error) throw error;
          console.log('New item added to cart');
        }
      } else {
        // Add to localStorage for guest users
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const existingItemIndex = guestCart.findIndex((cartItem: any) => cartItem.product_id === item.id);
        
        if (existingItemIndex >= 0) {
          guestCart[existingItemIndex].quantity += 1;
        } else {
          guestCart.push({
            id: `guest-${Date.now()}`,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_unit: item.unit || 'item',
            product_type: item.type || 'bundle',
            quantity: 1,
            product_items: item.items
          });
        }
        
        localStorage.setItem('khrate_guest_cart', JSON.stringify(guestCart));
        console.log('Item added to guest cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error; // Re-throw to handle in calling function
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const removeFromCart = useCallback(async (itemId: string) => {
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
      } else {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const filteredCart = guestCart.filter((item: any) => item.id !== itemId);
        localStorage.setItem('khrate_guest_cart', JSON.stringify(filteredCart));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
      } else {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const itemIndex = guestCart.findIndex((item: any) => item.id === itemId);
        if (itemIndex >= 0) {
          guestCart[itemIndex].quantity = quantity;
          localStorage.setItem('khrate_guest_cart', JSON.stringify(guestCart));
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, removeFromCart]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        console.log('Cart cleared from Supabase');
      } else {
        localStorage.removeItem('khrate_guest_cart');
        console.log('Guest cart cleared from localStorage');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading
  };
};
