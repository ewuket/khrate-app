
import { useState, useCallback } from 'react';

export const useCartState = () => {
  const [addingStates, setAddingStates] = useState<Record<string, boolean>>({});

  const setAdding = useCallback((itemId: string | number, isAdding: boolean) => {
    setAddingStates(prev => ({
      ...prev,
      [itemId]: isAdding
    }));
  }, []);

  const isAdding = useCallback((itemId: string | number) => {
    return addingStates[itemId] || false;
  }, [addingStates]);

  const clearAdding = useCallback((itemId: string | number) => {
    setAddingStates(prev => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  }, []);

  return { setAdding, isAdding, clearAdding };
};
