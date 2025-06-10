
import { useState } from 'react';
import { CartItem } from '@/types/cart';

export const useCartState = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  const setAdding = (itemId: string | number, isAdding: boolean) => {
    const key = String(itemId);
    setAddingItems(prev => {
      const newSet = new Set(prev);
      if (isAdding) {
        newSet.add(key);
      } else {
        newSet.delete(key);
      }
      return newSet;
    });
  };

  const isAdding = (itemId: string | number) => {
    return addingItems.has(String(itemId));
  };

  const clearAdding = (itemId: string | number) => {
    setAdding(itemId, false);
  };

  return {
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    addingItems,
    setAddingItems,
    setAdding,
    isAdding,
    clearAdding
  };
};
