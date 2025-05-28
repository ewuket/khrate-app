
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CartItem } from "@/types/cart";

export const useCartSync = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const syncCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      return;
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
        throw error;
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

      setCart(formattedCart);
      console.log('Cart synced successfully:', formattedCart);
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to load cart items');
      setCart([]); // Clear cart on error to prevent stale data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      syncCart();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return { cart, setCart, loading, syncCart };
};
