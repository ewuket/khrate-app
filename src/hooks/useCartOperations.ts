
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CartItem } from "@/types/cart";

export const useCartOperations = (
  cart: CartItem[], 
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  openCart: () => void
) => {
  const { user, isAuthenticated } = useAuth();

  const addToCart = async (item: any, type: 'bundle' | 'custom' | 'group') => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      console.log('Adding item to cart:', item, type);
      
      const existingItem = cart.find(cartItem => 
        cartItem.product_id === item.id && cartItem.product_type === type
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
        return;
      }

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

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };
};
