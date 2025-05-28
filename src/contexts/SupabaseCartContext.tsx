
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type CartItem = {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_unit: string;
  product_type: 'bundle' | 'custom' | 'group';
  product_items?: string[];
};

interface SupabaseCartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: any, type: 'bundle' | 'custom' | 'group') => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  syncCart: () => Promise<void>;
}

const SupabaseCartContext = createContext<SupabaseCartContextType | undefined>(undefined);

export const SupabaseCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Sync cart from Supabase when user logs in
  const syncCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      return;
    }

    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      syncCart();
    } else {
      setCart([]);
    }
  }, [user, isAuthenticated]);

  const addToCart = async (item: any, type: 'bundle' | 'custom' | 'group') => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      console.log('Adding item to cart:', item, type);
      
      // Check if item already exists in cart
      const existingItem = cart.find(cartItem => 
        cartItem.product_id === item.id && cartItem.product_type === type
      );

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
        return;
      }

      // Add new item
      const cartData = {
        user_id: user.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: 1,
        product_unit: item.unit || 'item',
        product_type: type,
        product_items: Array.isArray(item.items) ? item.items : null
      };

      console.log('Inserting cart data:', cartData);

      const { data, error } = await supabase
        .from('cart_items')
        .insert(cartData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Cart item inserted successfully:', data);

      const newCartItem: CartItem = {
        id: data.id,
        product_id: data.product_id,
        product_name: data.product_name,
        product_price: data.product_price,
        quantity: data.quantity,
        product_unit: data.product_unit,
        product_type: data.product_type as 'bundle' | 'custom' | 'group',
        product_items: Array.isArray(data.product_items) ? data.product_items as string[] : undefined
      };

      setCart(prevCart => [...prevCart, newCartItem]);
      openCart();
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCart(prevCart => prevCart.filter(item => item.id !== id));
      toast.info('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!isAuthenticated || !user) return;

    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCart(prevCart => 
        prevCart.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCart([]);
      toast.info("Cart has been cleared");
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  return (
    <SupabaseCartContext.Provider 
      value={{ 
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
      }}
    >
      {children}
    </SupabaseCartContext.Provider>
  );
};

export const useSupabaseCart = () => {
  const context = useContext(SupabaseCartContext);
  if (context === undefined) {
    throw new Error('useSupabaseCart must be used within a SupabaseCartProvider');
  }
  return context;
};
