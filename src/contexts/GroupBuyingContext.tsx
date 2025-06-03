
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupBuyingOperations } from "@/hooks/useGroupBuyingOperations";
import { useGroupBuyingActions } from "@/hooks/useGroupBuyingActions";
import { 
  GroupSession, 
  GroupMember, 
  GroupCartItem, 
  GroupPayment, 
  GroupSummary, 
  GroupPaymentSummary,
  GroupBuyingContextType 
} from "@/types/groupBuying";

const GroupBuyingContext = createContext<GroupBuyingContextType | undefined>(undefined);

export const GroupBuyingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGroup, setCurrentGroup] = useState<GroupSession | null>(null);
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupPayments, setGroupPayments] = useState<GroupPayment[]>([]);
  const [groupSummary, setGroupSummary] = useState<GroupSummary | null>(null);
  const [groupPaymentSummary, setGroupPaymentSummary] = useState<GroupPaymentSummary | null>(null);
  const [availableGroups, setAvailableGroups] = useState<GroupSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const operations = useGroupBuyingOperations();
  const actions = useGroupBuyingActions();

  // Load user's current group on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserGroup();
    }
    loadAvailableGroups();
  }, [isAuthenticated, user]);

  // Load group data when group changes
  useEffect(() => {
    if (currentGroup) {
      loadGroupData();
    }
  }, [currentGroup]);

  const loadUserGroup = async () => {
    const group = await operations.loadUserGroup(user);
    setCurrentGroup(group);
  };

  const loadGroupData = async () => {
    if (!currentGroup) return;

    const [members, cart, summary, payments, paymentSummary] = await Promise.all([
      operations.loadGroupMembers(currentGroup.id),
      operations.loadGroupCart(currentGroup.id),
      operations.loadGroupSummary(currentGroup.id),
      operations.loadGroupPayments(currentGroup.id),
      operations.loadGroupPaymentSummary(currentGroup.id)
    ]);

    setGroupMembers(members);
    setGroupCart(cart);
    setGroupSummary(summary);
    setGroupPayments(payments);
    setGroupPaymentSummary(paymentSummary);
  };

  const loadAvailableGroups = async () => {
    const groups = await operations.loadAvailableGroups();
    setAvailableGroups(groups);
  };

  const createGroup = async (name?: string, minParticipants?: number): Promise<string | null> => {
    setLoading(true);
    try {
      const joinCode = await actions.createGroup(user, isAuthenticated, name, minParticipants);
      if (joinCode) {
        await loadUserGroup();
        await loadAvailableGroups();
      }
      return joinCode;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (joinCode: string): Promise<boolean> => {
    setLoading(true);
    try {
      const group = await actions.joinGroup(user, isAuthenticated, joinCode);
      if (group) {
        setCurrentGroup(group);
        await loadAvailableGroups();
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async () => {
    await actions.leaveGroup(user, currentGroup);
    setCurrentGroup(null);
    setGroupCart([]);
    setGroupMembers([]);
    setGroupSummary(null);
    setGroupPayments([]);
    setGroupPaymentSummary(null);
    await loadAvailableGroups();
  };

  const addItemToGroupCart = async (item: any) => {
    await actions.addItemToGroupCart(user, currentGroup, item);
    await loadGroupData();
  };

  const removeItemFromGroupCart = async (id: string) => {
    await actions.removeItemFromGroupCart(user, id);
    await loadGroupData();
  };

  const updateGroupCartItemQuantity = async (id: string, quantity: number) => {
    await actions.updateGroupCartItemQuantity(user, id, quantity);
    await loadGroupData();
  };

  const clearGroupCart = async () => {
    await actions.clearGroupCart(user, currentGroup);
    await loadGroupData();
  };

  const completeGroupPayment = async (): Promise<boolean> => {
    const result = await actions.completeGroupPayment(user, currentGroup, groupCart, groupSummary);
    if (result) {
      await loadGroupData();
    }
    return result;
  };

  const completeGroupOrder = async (): Promise<boolean> => {
    const result = await actions.completeGroupOrder(user, currentGroup, groupPaymentSummary);
    if (result) {
      await loadUserGroup();
      await loadGroupData();
    }
    return result;
  };

  const getGroupTotal = () => {
    return groupCart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  return (
    <GroupBuyingContext.Provider
      value={{
        currentGroup,
        groupCart,
        groupCartItems: groupCart, // Alias for backward compatibility
        groupMembers,
        groupPayments,
        groupSummary,
        groupPaymentSummary,
        availableGroups,
        loading,
        createGroup,
        joinGroup,
        leaveGroup,
        addItemToGroupCart,
        removeItemFromGroupCart,
        updateGroupCartItemQuantity,
        clearGroupCart,
        getGroupTotal,
        loadAvailableGroups,
        completeGroupPayment,
        completeGroupOrder
      }}
    >
      {children}
    </GroupBuyingContext.Provider>
  );
};

export const useGroupBuying = () => {
  const context = useContext(GroupBuyingContext);
  if (context === undefined) {
    throw new Error('useGroupBuying must be used within a GroupBuyingProvider');
  }
  return context;
};
