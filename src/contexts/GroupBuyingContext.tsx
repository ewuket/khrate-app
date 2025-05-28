
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface GroupSession {
  id: string;
  name: string;
  join_code: string;
  leader_id: string;
  min_participants: number;
  max_participants: number;
  discount_percentage: number;
  status: string;
  created_at: string;
  member_count?: number;
}

interface GroupCartItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_unit: string;
  product_type: string;
  product_items?: string[];
}

interface GroupBuyingContextType {
  currentGroup: GroupSession | null;
  groupCart: GroupCartItem[];
  availableGroups: GroupSession[];
  loading: boolean;
  createGroup: (name: string) => Promise<void>;
  joinGroup: (joinCode: string) => Promise<void>;
  leaveGroup: () => Promise<void>;
  addToGroupCart: (item: any, type: 'bundle' | 'custom') => Promise<void>;
  removeFromGroupCart: (id: string) => Promise<void>;
  updateGroupCartQuantity: (id: string, quantity: number) => Promise<void>;
  clearGroupCart: () => Promise<void>;
  getGroupTotal: () => number;
  loadAvailableGroups: () => Promise<void>;
}

const GroupBuyingContext = createContext<GroupBuyingContextType | undefined>(undefined);

export const GroupBuyingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGroup, setCurrentGroup] = useState<GroupSession | null>(null);
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>([]);
  const [availableGroups, setAvailableGroups] = useState<GroupSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load available groups on mount
  useEffect(() => {
    loadAvailableGroups();
  }, []);

  const loadAvailableGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .select(`
          *,
          group_members(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupsWithMemberCount = data.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      }));

      setAvailableGroups(groupsWithMemberCount);
    } catch (error) {
      console.error('Error loading available groups:', error);
    }
  };

  const createGroup = async (name: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create a group');
      return;
    }

    setLoading(true);
    try {
      // Generate a unique join code
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_join_code');

      if (joinCodeError) throw joinCodeError;

      const { data, error } = await supabase
        .from('group_sessions')
        .insert({
          name,
          join_code: joinCodeData,
          leader_id: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as first member
      await supabase
        .from('group_members')
        .insert({
          group_session_id: data.id,
          user_id: user.id
        });

      setCurrentGroup(data);
      toast.success(`Group "${name}" created! Share code: ${joinCodeData}`);
      await loadAvailableGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (joinCode: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to join a group');
      return;
    }

    setLoading(true);
    try {
      // Find group by join code
      const { data: groupData, error: groupError } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('join_code', joinCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (groupError) throw new Error('Group not found');

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_session_id', groupData.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        setCurrentGroup(groupData);
        toast.info('You are already a member of this group');
        return;
      }

      // Add user to group
      await supabase
        .from('group_members')
        .insert({
          group_session_id: groupData.id,
          user_id: user.id
        });

      setCurrentGroup(groupData);
      toast.success(`Joined group "${groupData.name}"!`);
      await loadAvailableGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async () => {
    if (!currentGroup || !user) return;

    try {
      await supabase
        .from('group_members')
        .delete()
        .eq('group_session_id', currentGroup.id)
        .eq('user_id', user.id);

      setCurrentGroup(null);
      setGroupCart([]);
      toast.info('Left the group');
      await loadAvailableGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const addToGroupCart = async (item: any, type: 'bundle' | 'custom') => {
    if (!currentGroup || !user) {
      toast.error('Please join a group first');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('group_cart_items')
        .insert({
          group_session_id: currentGroup.id,
          user_id: user.id,
          product_id: item.id,
          product_name: item.name || item.title,
          product_price: item.price,
          quantity: 1,
          product_unit: item.unit || 'item',
          product_type: type,
          product_items: Array.isArray(item.items) ? item.items : null
        })
        .select()
        .single();

      if (error) throw error;

      const newCartItem: GroupCartItem = {
        id: data.id,
        product_id: data.product_id,
        product_name: data.product_name,
        product_price: data.product_price,
        quantity: data.quantity,
        product_unit: data.product_unit,
        product_type: data.product_type,
        product_items: data.product_items
      };

      setGroupCart(prev => [...prev, newCartItem]);
      toast.success(`${item.name || item.title} added to group cart`);
    } catch (error) {
      console.error('Error adding to group cart:', error);
      toast.error('Failed to add item to group cart');
    }
  };

  const removeFromGroupCart = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGroupCart(prev => prev.filter(item => item.id !== id));
      toast.info('Item removed from group cart');
    } catch (error) {
      console.error('Error removing from group cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateGroupCartQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromGroupCart(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGroupCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearGroupCart = async () => {
    if (!user || !currentGroup) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('group_session_id', currentGroup.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGroupCart([]);
      toast.info('Group cart cleared');
    } catch (error) {
      console.error('Error clearing group cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getGroupTotal = () => {
    return groupCart.reduce((total, item) => total + (item.product_price * item.quantity), 0);
  };

  return (
    <GroupBuyingContext.Provider
      value={{
        currentGroup,
        groupCart,
        availableGroups,
        loading,
        createGroup,
        joinGroup,
        leaveGroup,
        addToGroupCart,
        removeFromGroupCart,
        updateGroupCartQuantity,
        clearGroupCart,
        getGroupTotal,
        loadAvailableGroups
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
