
import { useState } from 'react';

export const useCartState = () => {
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  const setAdding = (itemKey: string, isAdding: boolean) => {
    setAddingItems(prev => {
      const newSet = new Set(prev);
      if (isAdding) {
        newSet.add(itemKey);
      } else {
        newSet.delete(itemKey);
      }
      return newSet;
    });
  };

  const isAdding = (itemKey: string) => {
    return addingItems.has(itemKey);
  };

  const clearAdding = (itemKey: string) => {
    setAdding(itemKey, false);
  };

  const clearAllAdding = () => {
    setAddingItems(new Set());
  };

  return {
    setAdding,
    isAdding,
    clearAdding,
    clearAllAdding
  };
};
