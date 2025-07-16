
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
  type: 'bundle' | 'custom' | 'group';
  items?: string[];
};

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: any, type: 'bundle' | 'custom' | 'group') => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('khrate-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('khrate-cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: any, type: 'bundle' | 'custom' | 'group') => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.id === item.id && cartItem.type === type
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
          unit: item.unit || 'item',
          type: type,
          items: item.items
        };
        return [...prevCart, newItem];
      }
    });
    openCart();
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart has been cleared");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        isCartOpen, 
        openCart, 
        closeCart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
