
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types/cart';

export const useSecureCartOperations = (
  cart: CartItem[], 
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  openCart: () => void
) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const addToCart = useCallback(async (item: any) => {
    console.log('Adding item to cart:', item);
    setLoading(true);
    
    try {
      // Optimistically update the cart first for immediate feedback
      const optimisticItem: CartItem = {
        id: `temp-${Date.now()}`,
        product_id: item.id,
        product_name: item.name || item.title,
        product_price: item.price,
        quantity: 1,
        product_unit: item.unit || 'bundle',
        product_type: item.type || 'bundle',
        product_items: item.items
      };
      
      setCart(prevCart => {
        const newCart = [...prevCart, optimisticItem];
        console.log('Cart updated optimistically:', newCart.length, 'items');
        return newCart;
      });
      
      // Open cart immediately for instant feedback
      openCart();
      
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
          
          // Remove optimistic item and reload cart
          setCart(prevCart => prevCart.filter(cartItem => !cartItem.id.startsWith('temp-')));
          await syncCartFromSupabase();
          toast.success(`${item.name || item.title} quantity updated in cart!`);
        } else {
          // Add new item to cart
          const cartItem = {
            user_id: user.id,
            product_id: item.id,
            product_name: item.name || item.title,
            product_price: item.price,
            product_unit: item.unit || 'bundle',
            product_type: item.type || 'bundle',
            quantity: 1,
            product_items: item.items
          };

          const { error } = await supabase
            .from('cart_items')
            .insert(cartItem);

          if (error) throw error;
          
          // Remove optimistic item and reload cart
          setCart(prevCart => prevCart.filter(cartItem => !cartItem.id.startsWith('temp-')));
          await syncCartFromSupabase();
          toast.success(`${item.name || item.title} added to cart!`);
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
            product_name: item.name || item.title,
            product_price: item.price,
            product_unit: item.unit || 'bundle',
            product_type: item.type || 'bundle',
            quantity: 1,
            product_items: item.items
          });
        }
        
        localStorage.setItem('khrate_guest_cart', JSON.stringify(guestCart));
        
        // Remove optimistic item and set real cart
        setCart(guestCart);
        toast.success(`${item.name || item.title} added to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Remove optimistic update on error
      setCart(prevCart => prevCart.filter(cartItem => !cartItem.id.startsWith('temp-')));
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, setCart, openCart]);

  const syncCartFromSupabase = async () => {
    if (!isAuthenticated || !user) return;

    try {
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
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const removeFromCart = useCallback(async (itemId: string) => {
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        await syncCartFromSupabase();
        toast.success('Item removed from cart');
      } else {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const filteredCart = guestCart.filter((item: any) => item.id !== itemId);
        localStorage.setItem('khrate_guest_cart', JSON.stringify(filteredCart));
        setCart(filteredCart);
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, setCart]);

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
        await syncCartFromSupabase();
      } else {
        const guestCart = JSON.parse(localStorage.getItem('khrate_guest_cart') || '[]');
        const itemIndex = guestCart.findIndex((item: any) => item.id === itemId);
        if (itemIndex >= 0) {
          guestCart[itemIndex].quantity = quantity;
          localStorage.setItem('khrate_guest_cart', JSON.stringify(guestCart));
          setCart(guestCart);
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, removeFromCart, setCart]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    
    try {
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        await syncCartFromSupabase();
      } else {
        localStorage.removeItem('khrate_guest_cart');
        setCart([]);
      }
      
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, setCart]);

  const getCartTotal = useCallback(() => {
    const total = cart.reduce((total, item) => {
      const itemTotal = (item.product_price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
    return total;
  }, [cart]);

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loading
  };
};
