
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types/cart';

export const useCartSync = () => {
  const { user, isAuthenticated } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const syncCart = async (): Promise<CartItem[]> => {
    if (!isAuthenticated || !user) {
      // Return guest cart from localStorage
      const guestCart = localStorage.getItem('khrate_guest_cart');
      if (guestCart) {
        try {
          return JSON.parse(guestCart);
        } catch (error) {
          console.error('Error parsing guest cart:', error);
          return [];
        }
      }
      return [];
    }

    setSyncing(true);
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

      console.log('Cart synced from Supabase:', formattedCart.length, 'items');
      return formattedCart;
    } catch (error) {
      console.error('Error syncing cart:', error);
      return [];
    } finally {
      setSyncing(false);
    }
  };

  return {
    syncCart,
    syncing
  };
};
