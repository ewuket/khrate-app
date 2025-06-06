
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GroupSession, GroupMember, GroupCartItem, GroupSummary } from '@/types/groupBuying';

interface GroupBuyingContextType {
  currentGroup: GroupSession | null;
  groupMembers: GroupMember[];
  groupCart: GroupCartItem[];
  groupSummary: GroupSummary | null;
  groupPayments: any[];
  isLoading: boolean;
  createGroup: (groupData: Partial<GroupSession>) => Promise<GroupSession | null>;
  joinGroup: (joinCode: string) => Promise<boolean>;
  leaveGroup: () => Promise<void>;
  addItemToGroupCart: (item: any) => Promise<void>;
  removeItemFromGroupCart: (itemId: string) => Promise<void>;
  updateGroupCartItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  completeGroupPayment: () => Promise<boolean>;
  getGroupTotal: () => number;
  syncGroupData: () => Promise<void>;
}

const GroupBuyingContext = createContext<GroupBuyingContextType | undefined>(undefined);

export const GroupBuyingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentGroup, setCurrentGroup] = useState<GroupSession | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupCart, setGroupCart] = useState<GroupCartItem[]>([]);
  const [groupSummary, setGroupSummary] = useState<GroupSummary | null>(null);
  const [groupPayments, setGroupPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateJoinCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const syncGroupData = async () => {
    if (!currentGroup || !user) return;

    try {
      // Fetch group members
      const { data: members } = await supabase
        .from('group_members')
        .select(`
          *,
          user_profile:user_profiles(*)
        `)
        .eq('group_session_id', currentGroup.id);

      // Fetch group cart items
      const { data: cartItems } = await supabase
        .from('group_cart_items')
        .select('*')
        .eq('group_session_id', currentGroup.id);

      // Fetch group payments
      const { data: payments } = await supabase
        .from('group_member_payments')
        .select('*')
        .eq('group_session_id', currentGroup.id);

      setGroupMembers(members || []);
      setGroupCart(cartItems || []);
      setGroupPayments(payments || []);

      // Calculate group summary
      const total = (cartItems || []).reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
      const memberCount = (members || []).length + 1; // +1 for leader
      const qualifiesForDiscount = memberCount >= currentGroup.min_participants;
      const discountAmount = qualifiesForDiscount ? total * (currentGroup.discount_percentage / 100) : 0;

      setGroupSummary({
        member_count: memberCount,
        total_amount: total,
        discount_amount: discountAmount,
        final_amount: total - discountAmount,
        qualifies_for_discount: qualifiesForDiscount
      });

    } catch (error) {
      console.error('Error syncing group data:', error);
    }
  };

  const createGroup = async (groupData: Partial<GroupSession>): Promise<GroupSession | null> => {
    if (!user) {
      toast.error('Please log in to create a group');
      return null;
    }

    setIsLoading(true);
    try {
      const joinCode = generateJoinCode();
      
      const { data, error } = await supabase
        .from('group_sessions')
        .insert({
          leader_id: user.id,
          name: groupData.name || 'New Group',
          join_code: joinCode,
          min_participants: groupData.min_participants || 3,
          max_participants: groupData.max_participants || 10,
          discount_percentage: groupData.discount_percentage || 10,
          group_type: groupData.group_type || 'private',
          is_public: groupData.is_public || false,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentGroup(data);
      toast.success(`Group created! Join code: ${joinCode}`);
      await syncGroupData();
      return data;

    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (joinCode: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to join a group');
      return false;
    }

    setIsLoading(true);
    try {
      // Find group by join code
      const { data: group, error: groupError } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('join_code', joinCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (groupError || !group) {
        toast.error('Invalid join code or group not found');
        return false;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_session_id', group.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already a member of this group');
        return false;
      }

      // Join the group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_session_id: group.id,
          user_id: user.id
        });

      if (joinError) throw joinError;

      setCurrentGroup(group);
      toast.success(`Successfully joined ${group.name}!`);
      await syncGroupData();
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
      if (currentGroup.leader_id === user.id) {
        // Leader leaving - delete the entire group
        await supabase
          .from('group_sessions')
          .delete()
          .eq('id', currentGroup.id);
        toast.success('Group disbanded');
      } else {
        // Member leaving
        await supabase
          .from('group_members')
          .delete()
          .eq('group_session_id', currentGroup.id)
          .eq('user_id', user.id);
        toast.success('Left group');
      }

      setCurrentGroup(null);
      setGroupMembers([]);
      setGroupCart([]);
      setGroupSummary(null);
      setGroupPayments([]);

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
          product_name: item.name || item.title,
          product_price: item.price,
          product_unit: item.unit || 'item',
          product_type: item.type || 'bundle',
          product_items: item.items,
          quantity: 1
        });

      if (error) throw error;

      toast.success('Item added to group cart');
      await syncGroupData();

    } catch (error) {
      console.error('Error adding item to group cart:', error);
      toast.error('Failed to add item to group cart');
    }
  };

  const removeItemFromGroupCart = async (itemId: string): Promise<void> => {
    if (!currentGroup) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Item removed from group cart');
      await syncGroupData();

    } catch (error) {
      console.error('Error removing item from group cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateGroupCartItemQuantity = async (itemId: string, quantity: number): Promise<void> => {
    if (!currentGroup) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      await syncGroupData();

    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const completeGroupPayment = async (): Promise<boolean> => {
    if (!currentGroup || !user || !groupSummary) return false;

    try {
      // Record payment
      const { error: paymentError } = await supabase
        .from('group_member_payments')
        .insert({
          group_session_id: currentGroup.id,
          user_id: user.id,
          amount: groupSummary.final_amount / groupSummary.member_count,
          payment_status: 'completed',
          payment_method: 'mtn'
        });

      if (paymentError) throw paymentError;

      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: groupCart.map(item => ({
            name: item.product_name,
            price: item.product_price,
            quantity: item.quantity
          })),
          total_amount: groupSummary.final_amount / groupSummary.member_count,
          original_amount: groupSummary.total_amount / groupSummary.member_count,
          discount_applied: groupSummary.discount_amount / groupSummary.member_count,
          delivery_address: 'Group Buy Address',
          payment_method: 'mtn',
          payment_status: 'completed',
          status: 'confirmed'
        });

      if (orderError) throw orderError;

      toast.success('Payment completed successfully!');
      return true;

    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error('Payment failed');
      return false;
    }
  };

  const getGroupTotal = (): number => {
    return groupSummary?.final_amount || 0;
  };

  // Load user's current group on mount
  useEffect(() => {
    if (!user) return;

    const loadCurrentGroup = async () => {
      try {
        // Check if user is a leader of any active group
        const { data: leaderGroup } = await supabase
          .from('group_sessions')
          .select('*')
          .eq('leader_id', user.id)
          .eq('status', 'active')
          .single();

        if (leaderGroup) {
          setCurrentGroup(leaderGroup);
          await syncGroupData();
          return;
        }

        // Check if user is a member of any active group
        const { data: memberGroup } = await supabase
          .from('group_members')
          .select('group_sessions(*)')
          .eq('user_id', user.id)
          .single();

        if (memberGroup?.group_sessions) {
          setCurrentGroup(memberGroup.group_sessions as GroupSession);
          await syncGroupData();
        }

      } catch (error) {
        console.error('Error loading current group:', error);
      }
    };

    loadCurrentGroup();
  }, [user]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!currentGroup) return;

    const channel = supabase
      .channel('group-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'group_members', filter: `group_session_id=eq.${currentGroup.id}` },
        () => syncGroupData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'group_cart_items', filter: `group_session_id=eq.${currentGroup.id}` },
        () => syncGroupData()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'group_member_payments', filter: `group_session_id=eq.${currentGroup.id}` },
        () => syncGroupData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGroup]);

  return (
    <GroupBuyingContext.Provider value={{
      currentGroup,
      groupMembers,
      groupCart,
      groupSummary,
      groupPayments,
      isLoading,
      createGroup,
      joinGroup,
      leaveGroup,
      addItemToGroupCart,
      removeItemFromGroupCart,
      updateGroupCartItemQuantity,
      completeGroupPayment,
      getGroupTotal,
      syncGroupData
    }}>
      {children}
    </GroupBuyingContext.Provider>
  );
};

export const useGroupBuying = () => {
  const context = useContext(GroupBuyingContext);
  if (!context) {
    throw new Error('useGroupBuying must be used within a GroupBuyingProvider');
  }
  return context;
};
