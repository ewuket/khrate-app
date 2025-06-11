
import { useState } from 'react';
import { CartItem } from '@/types/cart';

export const useCartState = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingStates, setAddingStates] = useState<Record<string, boolean>>({});

  const isAdding = (key: string): boolean => {
    return addingStates[key] || false;
  };

  const setAdding = (key: string, isAdding: boolean) => {
    setAddingStates(prev => ({
      ...prev,
      [key]: isAdding
    }));
  };

  const clearAdding = (key: string) => {
    setAddingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const clearAllAdding = () => {
    setAddingStates({});
  };

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    isAdding,
    setAdding,
    clearAdding,
    clearAllAdding
  };
};
