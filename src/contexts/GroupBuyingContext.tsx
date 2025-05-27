
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface GroupSession {
  id: string;
  name?: string;
  join_code: string;
  leader_id: string;
  min_participants: number;
  max_participants: number;
  discount_percentage: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface GroupMember {
  id: string;
  group_session_id: string;
  user_id: string;
  joined_at: string;
  user_profile?: {
    full_name?: string;
    email: string;
  };
}

interface GroupCartItem {
  id: string;
  group_session_id: string;
  user_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  product_type: string;
  product_unit: string;
  product_items?: any;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface GroupSummary {
  member_count: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  qualifies_for_discount: boolean;
}

interface GroupBuyingContextType {
  currentGroup: GroupSession | null;
  groupMembers: GroupMember[];
  groupCartItems: GroupCartItem[];
  groupSummary: GroupSummary | null;
  isLoading: boolean;
  createGroup: (name?: string, minParticipants?: number) => Promise<string | null>;
  joinGroup: (joinCode: string) => Promise<boolean>;
  leaveGroup: () => Promise<void>;
  addItemToGroupCart: (item: any) => Promise<void>;
  removeItemFromGroupCart: (itemId: string) => Promise<void>;
  updateGroupCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  completeGroupOrder: () => Promise<boolean>;
}

const GroupBuyingContext = createContext<GroupBuyingContextType | undefined>(undefined);

export const GroupBuyingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentGroup, setCurrentGroup] = useState<GroupSession | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupCartItems, setGroupCartItems] = useState<GroupCartItem[]>([]);
  const [groupSummary, setGroupSummary] = useState<GroupSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentGroup) return;

    const groupChannel = supabase
      .channel(`group-${currentGroup.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_members',
        filter: `group_session_id=eq.${currentGroup.id}`
      }, () => {
        fetchGroupMembers(currentGroup.id);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_cart_items',
        filter: `group_session_id=eq.${currentGroup.id}`
      }, () => {
        fetchGroupCartItems(currentGroup.id);
        fetchGroupSummary(currentGroup.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(groupChannel);
    };
  }, [currentGroup?.id]);

  const fetchGroupMembers = async (groupId: string) => {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        user_profiles!inner(full_name, email)
      `)
      .eq('group_session_id', groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      return;
    }

    const membersWithProfiles = data.map(member => ({
      ...member,
      user_profile: member.user_profiles
    }));

    setGroupMembers(membersWithProfiles);
  };

  const fetchGroupCartItems = async (groupId: string) => {
    const { data, error } = await supabase
      .from('group_cart_items')
      .select('*')
      .eq('group_session_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching group cart items:', error);
      return;
    }

    setGroupCartItems(data);
  };

  const fetchGroupSummary = async (groupId: string) => {
    const { data, error } = await supabase
      .rpc('get_group_summary', { group_id: groupId });

    if (error) {
      console.error('Error fetching group summary:', error);
      return;
    }

    if (data && data.length > 0) {
      setGroupSummary(data[0]);
    }
  };

  const createGroup = async (name?: string, minParticipants = 3): Promise<string | null> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create a group');
      return null;
    }

    setIsLoading(true);
    try {
      // Generate join code
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_join_code');

      if (joinCodeError) throw joinCodeError;

      // Create group session
      const { data: groupData, error: groupError } = await supabase
        .from('group_sessions')
        .insert({
          name,
          join_code: joinCodeData,
          leader_id: user.id,
          min_participants: minParticipants
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_session_id: groupData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      setCurrentGroup(groupData);
      toast.success(`Group created! Share code: ${joinCodeData}`);
      
      // Fetch initial data
      await Promise.all([
        fetchGroupMembers(groupData.id),
        fetchGroupCartItems(groupData.id),
        fetchGroupSummary(groupData.id)
      ]);

      return joinCodeData;
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (joinCode: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to join a group');
      return false;
    }

    setIsLoading(true);
    try {
      // Find group by join code
      const { data: groupData, error: groupError } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('join_code', joinCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (groupError || !groupData) {
        toast.error('Invalid join code or group not found');
        return false;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_session_id', groupData.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already a member of this group');
        setCurrentGroup(groupData);
        await Promise.all([
          fetchGroupMembers(groupData.id),
          fetchGroupCartItems(groupData.id),
          fetchGroupSummary(groupData.id)
        ]);
        return true;
      }

      // Add as member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_session_id: groupData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      setCurrentGroup(groupData);
      toast.success('Successfully joined the group!');
      
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGroup = async (): Promise<void> => {
    if (!currentGroup || !user) return;

    try {
      await supabase
        .from('group_members')
        .delete()
        .eq('group_session_id', currentGroup.id)
        .eq('user_id', user.id);

      setCurrentGroup(null);
      setGroupMembers([]);
      setGroupCartItems([]);
      setGroupSummary(null);
      toast.success('Left the group');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const addItemToGroupCart = async (item: any): Promise<void> => {
    if (!currentGroup || !user) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .insert({
          group_session_id: currentGroup.id,
          user_id: user.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          product_type: item.type || 'product',
          product_unit: item.unit || 'item',
          product_items: item.items || null,
          quantity: 1
        });

      if (error) throw error;
      toast.success('Item added to group cart');
    } catch (error) {
      console.error('Error adding item to group cart:', error);
      toast.error('Failed to add item to group cart');
    }
  };

  const removeItemFromGroupCart = async (itemId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      toast.success('Item removed from group cart');
    } catch (error) {
      console.error('Error removing item from group cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateGroupCartItemQuantity = async (itemId: string, quantity: number): Promise<void> => {
    if (quantity <= 0) {
      await removeItemFromGroupCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const completeGroupOrder = async (): Promise<boolean> => {
    if (!currentGroup || !user || currentGroup.leader_id !== user.id) {
      toast.error('Only group leaders can complete orders');
      return false;
    }

    try {
      // Update group status to completed
      const { error } = await supabase
        .from('group_sessions')
        .update({ status: 'completed' })
        .eq('id', currentGroup.id);

      if (error) throw error;

      toast.success('Group order completed!');
      return true;
    } catch (error) {
      console.error('Error completing group order:', error);
      toast.error('Failed to complete group order');
      return false;
    }
  };

  const value: GroupBuyingContextType = {
    currentGroup,
    groupMembers,
    groupCartItems,
    groupSummary,
    isLoading,
    createGroup,
    joinGroup,
    leaveGroup,
    addItemToGroupCart,
    removeItemFromGroupCart,
    updateGroupCartItemQuantity,
    completeGroupOrder
  };

  return (
    <GroupBuyingContext.Provider value={value}>
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
