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
  order_status: string;
  created_at: string;
  member_count?: number;
}

interface GroupMember {
  id: string;
  user_id: string;
  group_session_id: string;
  joined_at: string;
  user_profile?: {
    full_name?: string;
    email: string;
  };
}

interface GroupCartItem {
  id: string;
  user_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  product_unit: string;
  product_type: string;
  product_items?: string[];
}

interface GroupPayment {
  id: string;
  user_id: string;
  amount: number;
  payment_status: string;
  payment_method?: string;
  created_at: string;
}

interface GroupSummary {
  member_count: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  qualifies_for_discount: boolean;
}

interface GroupPaymentSummary {
  total_members: number;
  paid_members: number;
  pending_members: number;
  total_amount_paid: number;
  group_ready: boolean;
}

interface GroupBuyingContextType {
  currentGroup: GroupSession | null;
  groupCart: GroupCartItem[];
  groupCartItems: GroupCartItem[]; // Keep both for backward compatibility
  groupMembers: GroupMember[];
  groupPayments: GroupPayment[];
  groupSummary: GroupSummary | null;
  groupPaymentSummary: GroupPaymentSummary | null;
  availableGroups: GroupSession[];
  loading: boolean;
  createGroup: (name?: string, minParticipants?: number) => Promise<string | null>;
  joinGroup: (joinCode: string) => Promise<boolean>;
  leaveGroup: () => Promise<void>;
  addItemToGroupCart: (item: any) => Promise<void>;
  removeItemFromGroupCart: (id: string) => Promise<void>;
  updateGroupCartItemQuantity: (id: string, quantity: number) => Promise<void>;
  clearGroupCart: () => Promise<void>;
  getGroupTotal: () => number;
  loadAvailableGroups: () => Promise<void>;
  completeGroupPayment: () => Promise<boolean>;
  completeGroupOrder: () => Promise<boolean>;
}

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
      loadGroupMembers();
      loadGroupCart();
      loadGroupSummary();
      loadGroupPayments();
      loadGroupPaymentSummary();
    }
  }, [currentGroup]);

  const loadUserGroup = async () => {
    if (!user) return;

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('group_members')
        .select(`
          group_session_id,
          group_sessions!group_members_group_session_id_fkey (*)
        `)
        .eq('user_id', user.id)
        .single();

      if (memberError && memberError.code !== 'PGRST116') {
        console.error('Error loading user group:', memberError);
        return;
      }

      if (memberData?.group_sessions) {
        setCurrentGroup(memberData.group_sessions as GroupSession);
      }
    } catch (error) {
      console.error('Error loading user group:', error);
    }
  };

  const loadGroupMembers = async () => {
    if (!currentGroup) return;

    try {
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_session_id', currentGroup.id);

      if (membersError) throw membersError;

      const memberIds = membersData.map(member => member.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .in('id', memberIds);

      if (profilesError) throw profilesError;

      const members: GroupMember[] = membersData.map(member => {
        const profile = profilesData.find(p => p.id === member.user_id);
        return {
          id: member.id,
          user_id: member.user_id,
          group_session_id: member.group_session_id,
          joined_at: member.joined_at,
          user_profile: profile ? {
            full_name: profile.full_name,
            email: profile.email
          } : {
            email: 'Unknown User'
          }
        };
      });

      setGroupMembers(members);
    } catch (error) {
      console.error('Error loading group members:', error);
    }
  };

  const loadGroupCart = async () => {
    if (!currentGroup) return;

    try {
      const { data, error } = await supabase
        .from('group_cart_items')
        .select('*')
        .eq('group_session_id', currentGroup.id);

      if (error) throw error;

      const cartItems: GroupCartItem[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
        product_unit: item.product_unit,
        product_type: item.product_type,
        product_items: Array.isArray(item.product_items) 
          ? item.product_items.filter((item): item is string => typeof item === 'string')
          : []
      }));

      setGroupCart(cartItems);
    } catch (error) {
      console.error('Error loading group cart:', error);
    }
  };

  const loadGroupPayments = async () => {
    if (!currentGroup) return;

    try {
      const { data, error } = await supabase
        .from('group_member_payments')
        .select('*')
        .eq('group_session_id', currentGroup.id);

      if (error) throw error;

      setGroupPayments(data || []);
    } catch (error) {
      console.error('Error loading group payments:', error);
    }
  };

  const loadGroupSummary = async () => {
    if (!currentGroup) return;

    try {
      const { data, error } = await supabase
        .rpc('get_group_summary', { group_id: currentGroup.id });

      if (error) throw error;

      if (data && data.length > 0) {
        setGroupSummary(data[0]);
      }
    } catch (error) {
      console.error('Error loading group summary:', error);
    }
  };

  const loadGroupPaymentSummary = async () => {
    if (!currentGroup) return;

    try {
      const { data, error } = await supabase
        .rpc('get_group_payment_summary', { group_id: currentGroup.id });

      if (error) throw error;

      if (data && data.length > 0) {
        setGroupPaymentSummary(data[0]);
      }
    } catch (error) {
      console.error('Error loading group payment summary:', error);
    }
  };

  const loadAvailableGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('group_sessions')
        .select(`
          *,
          group_members!group_members_group_session_id_fkey(count)
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

  const createGroup = async (name?: string, minParticipants: number = 3): Promise<string | null> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create a group');
      return null;
    }

    setLoading(true);
    try {
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_join_code');

      if (joinCodeError) throw joinCodeError;

      const { data, error } = await supabase
        .from('group_sessions')
        .insert({
          name: name || `${user.email?.split('@')[0]}'s Group`,
          join_code: joinCodeData,
          leader_id: user.id,
          min_participants: minParticipants,
          status: 'active',
          order_status: 'collecting'
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('group_members')
        .insert({
          group_session_id: data.id,
          user_id: user.id
        });

      setCurrentGroup(data);
      toast.success(`Group created! Share code: ${joinCodeData}`);
      await loadAvailableGroups();
      return joinCodeData;
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (joinCode: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to join a group');
      return false;
    }

    setLoading(true);
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('join_code', joinCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (groupError) throw new Error('Group not found');

      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_session_id', groupData.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        setCurrentGroup(groupData);
        toast.info('You are already a member of this group');
        return true;
      }

      await supabase
        .from('group_members')
        .insert({
          group_session_id: groupData.id,
          user_id: user.id
        });

      setCurrentGroup(groupData);
      toast.success(`Joined group "${groupData.name}"!`);
      await loadAvailableGroups();
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please check the code.');
      return false;
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
      setGroupMembers([]);
      setGroupSummary(null);
      setGroupPayments([]);
      setGroupPaymentSummary(null);
      toast.info('Left the group');
      await loadAvailableGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const addItemToGroupCart = async (item: any) => {
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
          product_type: item.type || 'bundle',
          product_items: Array.isArray(item.items) ? item.items : []
        })
        .select()
        .single();

      if (error) throw error;

      await loadGroupCart();
      await loadGroupSummary();
      toast.success(`${item.name || item.title} added to group cart`);
    } catch (error) {
      console.error('Error adding to group cart:', error);
      toast.error('Failed to add item to group cart');
    }
  };

  const removeItemFromGroupCart = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadGroupCart();
      await loadGroupSummary();
      toast.info('Item removed from group cart');
    } catch (error) {
      console.error('Error removing from group cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateGroupCartItemQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItemFromGroupCart(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadGroupCart();
      await loadGroupSummary();
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

      await loadGroupCart();
      await loadGroupSummary();
      toast.info('Group cart cleared');
    } catch (error) {
      console.error('Error clearing group cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const completeGroupPayment = async (): Promise<boolean> => {
    if (!currentGroup || !user || !groupSummary) {
      toast.error('Cannot complete payment');
      return false;
    }

    try {
      // Calculate user's share of the total
      const userItems = groupCart.filter(item => item.user_id === user.id);
      const userTotal = userItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
      
      // Apply discount if qualified
      const finalAmount = groupSummary.qualifies_for_discount 
        ? userTotal * (1 - currentGroup.discount_percentage / 100)
        : userTotal;

      const { error } = await supabase
        .from('group_member_payments')
        .upsert({
          group_session_id: currentGroup.id,
          user_id: user.id,
          amount: finalAmount,
          payment_status: 'completed',
          payment_method: 'manual'
        });

      if (error) throw error;

      await loadGroupPayments();
      await loadGroupPaymentSummary();
      toast.success('Payment completed successfully!');
      return true;
    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error('Failed to complete payment');
      return false;
    }
  };

  const completeGroupOrder = async (): Promise<boolean> => {
    if (!currentGroup || !user || !groupPaymentSummary) {
      toast.error('Cannot complete order');
      return false;
    }

    // Only group leader can complete the order
    if (user.id !== currentGroup.leader_id) {
      toast.error('Only the group leader can complete the order');
      return false;
    }

    // Check if all members have paid
    if (!groupPaymentSummary.group_ready) {
      toast.error('All members must complete payment before ordering');
      return false;
    }

    try {
      const { error } = await supabase
        .from('group_sessions')
        .update({ 
          order_status: 'ordered',
          status: 'completed' 
        })
        .eq('id', currentGroup.id);

      if (error) throw error;

      toast.success('Group order completed successfully!');
      
      // Reload group data
      await loadUserGroup();
      await loadGroupCart();
      
      return true;
    } catch (error) {
      console.error('Error completing group order:', error);
      toast.error('Failed to complete group order');
      return false;
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
