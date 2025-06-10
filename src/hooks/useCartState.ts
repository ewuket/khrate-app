
import { useState } from 'react';
import { CartItem } from '@/types/cart';

export const useCartState = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen
  };
};
