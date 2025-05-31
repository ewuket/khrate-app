
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CartItem } from "@/types/cart";
import { useInputValidation } from "./useInputValidation";

export const useSecureCartOperations = (
  cart: CartItem[], 
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  openCart: () => void
) => {
  const { user, isAuthenticated } = useAuth();
  const { sanitizeTextInput } = useInputValidation();

  const addToCart = async (item: any, type: 'bundle' | 'custom' | 'group') => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      console.log('Adding item to cart with security validation:', item, type);
      
      // Sanitize inputs
      const sanitizedName = await sanitizeTextInput(item.name, 255);
      const sanitizedUnit = await sanitizeTextInput(item.unit || 'item', 50);
      
      // Validate required fields
      if (!sanitizedName || !item.price || !item.id) {
        toast.error('Invalid item data');
        return;
      }

      // Validate price is positive
      if (typeof item.price !== 'number' || item.price <= 0) {
        toast.error('Invalid item price');
        return;
      }

      // Check if item already exists in cart
      const existingItem = cart.find(cartItem => 
        cartItem.product_id === item.id && cartItem.product_type === type
      );

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
        toast.success(`${sanitizedName} quantity updated in cart`);
        return;
      }

      // Prepare sanitized cart data for insertion
      const cartData = {
        user_id: user.id,
        product_id: item.id,
        product_name: sanitizedName,
        product_price: item.price,
        quantity: 1,
        product_unit: sanitizedUnit,
        product_type: type,
        product_items: Array.isArray(item.items) ? item.items : null
      };

      console.log('Inserting sanitized cart data:', cartData);

      const { data, error } = await supabase
        .from('cart_items')
        .insert(cartData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        if (error.message.includes('row-level security')) {
          toast.error('Security error: Unable to add item to cart');
        } else {
          toast.error('Failed to add item to cart');
        }
        return;
      }

      console.log('Cart item inserted successfully:', data);

      // Create new cart item for local state
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

      // Update local cart state
      setCart(prevCart => [...prevCart, newCartItem]);
      
      // Open cart sidebar
      openCart();
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Authentication required');
      return;
    }

    try {
      console.log('Removing cart item with security check:', id);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Double security check

      if (error) {
        console.error('Error removing cart item:', error);
        if (error.message.includes('row-level security')) {
          toast.error('Security error: Unable to remove item');
        } else {
          toast.error('Failed to remove item from cart');
        }
        return;
      }

      setCart(prevCart => prevCart.filter(item => item.id !== id));
      toast.info('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!isAuthenticated || !user) {
      toast.error('Authentication required');
      return;
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 0) {
      toast.error('Invalid quantity');
      return;
    }

    if (quantity === 0) {
      await removeFromCart(id);
      return;
    }

    // Limit maximum quantity for security
    if (quantity > 999) {
      toast.error('Maximum quantity is 999');
      return;
    }

    try {
      console.log('Updating cart item quantity with security check:', id, quantity);
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id); // Double security check

      if (error) {
        console.error('Error updating quantity:', error);
        if (error.message.includes('row-level security')) {
          toast.error('Security error: Unable to update quantity');
        } else {
          toast.error('Failed to update quantity');
        }
        return;
      }

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
    if (!isAuthenticated || !user) {
      toast.error('Authentication required');
      return;
    }

    try {
      console.log('Clearing cart with security check for user:', user.id);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        if (error.message.includes('row-level security')) {
          toast.error('Security error: Unable to clear cart');
        } else {
          toast.error('Failed to clear cart');
        }
        return;
      }

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
