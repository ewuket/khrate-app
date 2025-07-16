
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useGroupBuyingOperations } from '@/hooks/useGroupBuyingOperations';
import { useGroupBuyingActions } from '@/hooks/useGroupBuyingActions';
import { GroupSession, GroupMember, GroupCartItem, GroupSummary, GroupPaymentSummary } from '@/types/groupBuying';

interface GroupBuyingContextType {
  // State
  currentGroup: GroupSession | null;
  groupMembers: GroupMember[];
  groupCart: GroupCartItem[];
  groupSummary: GroupSummary | null;
  groupPaymentSummary: GroupPaymentSummary | null;
  availableGroups: GroupSession[];
  isLoading: boolean;

  // Actions
  joinGroup: (joinCode: string) => Promise<GroupSession | null>;
  leaveGroup: () => Promise<void>;
  addItemToGroupCart: (item: any) => Promise<void>;
  removeItemFromGroupCart: (id: string) => Promise<void>;
  updateGroupCartItemQuantity: (id: string, quantity: number) => Promise<void>;
  clearGroupCart: () => Promise<void>;
  completeGroupPayment: (groupCart: any[], groupSummary: any) => Promise<boolean>;
  completeGroupOrder: (groupPaymentSummary: any) => Promise<boolean>;
  
  // Data loading
  refreshGroupData: () => Promise<void>;
  loadAvailableGroups: () => Promise<void>;
}

const GroupBuyingContext = createContext<GroupBuyingContextType | undefined>(undefined);

interface GroupBuyingProviderProps {
  children: ReactNode;
}

export const GroupBuyingProvider: React.FC<GroupBuyingProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const operations = useGroupBuyingOperations();
  const actions = useGroupBuyingActions();

  // State
  const [currentGroup, setCurrentGroup] = useState<GroupSession | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>([]);
  const [groupSummary, setGroupSummary] = useState<GroupSummary | null>(null);
  const [groupPaymentSummary, setGroupPaymentSummary] = useState<GroupPaymentSummary | null>(null);
  const [availableGroups, setAvailableGroups] = useState<GroupSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserGroup();
      loadAvailableGroups();
    } else {
      // Clear data when user logs out
      setCurrentGroup(null);
      setGroupMembers([]);
      setGroupCart([]);
      setGroupSummary(null);
      setGroupPaymentSummary(null);
    }
  }, [user, isAuthenticated]);

  // Load group-specific data when current group changes
  useEffect(() => {
    if (currentGroup) {
      refreshGroupData();
    }
  }, [currentGroup?.id]);

  const loadUserGroup = async () => {
    try {
      setIsLoading(true);
      const group = await operations.loadUserGroup(user);
      setCurrentGroup(group);
    } catch (error) {
      console.error('Error loading user group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableGroups = async () => {
    try {
      const groups = await operations.loadAvailableGroups();
      setAvailableGroups(groups);
    } catch (error) {
      console.error('Error loading available groups:', error);
    }
  };

  const refreshGroupData = async () => {
    if (!currentGroup) return;

    try {
      const [members, cart, summary, paymentSummary] = await Promise.all([
        operations.loadGroupMembers(currentGroup.id),
        operations.loadGroupCart(currentGroup.id),
        operations.loadGroupSummary(currentGroup.id),
        operations.loadGroupPaymentSummary(currentGroup.id)
      ]);

      setGroupMembers(members);
      setGroupCart(cart);
      setGroupSummary(summary);
      setGroupPaymentSummary(paymentSummary);
    } catch (error) {
      console.error('Error refreshing group data:', error);
    }
  };

  // Wrapped actions that update local state
  const joinGroup = async (joinCode: string): Promise<GroupSession | null> => {
    const group = await actions.joinGroup(user, isAuthenticated, joinCode);
    if (group) {
      setCurrentGroup(group);
    }
    return group;
  };

  const leaveGroup = async (): Promise<void> => {
    await actions.leaveGroup(user, currentGroup);
    setCurrentGroup(null);
    setGroupMembers([]);
    setGroupCart([]);
    setGroupSummary(null);
    setGroupPaymentSummary(null);
  };

  const addItemToGroupCart = async (item: any): Promise<void> => {
    await actions.addItemToGroupCart(user, currentGroup, item);
    await refreshGroupData();
  };

  const removeItemFromGroupCart = async (id: string): Promise<void> => {
    await actions.removeItemFromGroupCart(user, id);
    await refreshGroupData();
  };

  const updateGroupCartItemQuantity = async (id: string, quantity: number): Promise<void> => {
    await actions.updateGroupCartItemQuantity(user, id, quantity);
    await refreshGroupData();
  };

  const clearGroupCart = async (): Promise<void> => {
    await actions.clearGroupCart(user, currentGroup);
    await refreshGroupData();
  };

  const completeGroupPayment = async (groupCart: any[], groupSummary: any): Promise<boolean> => {
    const success = await actions.completeGroupPayment(user, currentGroup, groupCart, groupSummary);
    if (success) {
      await refreshGroupData();
    }
    return success;
  };

  const completeGroupOrder = async (groupPaymentSummary: any): Promise<boolean> => {
    const success = await actions.completeGroupOrder(user, currentGroup, groupPaymentSummary);
    if (success) {
      await refreshGroupData();
    }
    return success;
  };

  const contextValue: GroupBuyingContextType = {
    // State
    currentGroup,
    groupMembers,
    groupCart,
    groupSummary,
    groupPaymentSummary,
    availableGroups,
    isLoading,

    // Actions
    joinGroup,
    leaveGroup,
    addItemToGroupCart,
    removeItemFromGroupCart,
    updateGroupCartItemQuantity,
    clearGroupCart,
    completeGroupPayment,
    completeGroupOrder,

    // Data loading
    refreshGroupData,
    loadAvailableGroups
  };

  return (
    <GroupBuyingContext.Provider value={contextValue}>
      {children}
    </GroupBuyingContext.Provider>
  );
};

export const useGroupBuying = (): GroupBuyingContextType => {
  const context = useContext(GroupBuyingContext);
  if (!context) {
    throw new Error('useGroupBuying must be used within a GroupBuyingProvider');
  }
  return context;
};
