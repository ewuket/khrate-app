
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CartItem } from "@/types/cart";

export const useCartSync = () => {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const syncCart = async (): Promise<CartItem[]> => {
    if (!isAuthenticated || !user) {
      return [];
    }

    setLoading(true);
    try {
      console.log('Syncing cart for user:', user.id);
      
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error syncing cart:', error);
        toast.error('Failed to load cart items');
        return [];
      }
      
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

      console.log('Cart synced successfully:', formattedCart.length, 'items');
      return formattedCart;
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to load cart items');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { syncCart, loading };
};
