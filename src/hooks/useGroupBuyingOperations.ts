
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroupSession, GroupMember, GroupCartItem, GroupPayment, GroupSummary, GroupPaymentSummary } from "@/types/groupBuying";

interface User {
  id: string;
  email?: string;
}

export const useGroupBuyingOperations = () => {
  const loadUserGroup = async (user: User | null): Promise<GroupSession | null> => {
    if (!user) return null;

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
        return null;
      }

      if (memberData?.group_sessions) {
        return memberData.group_sessions as GroupSession;
      }
      return null;
    } catch (error) {
      console.error('Error loading user group:', error);
      return null;
    }
  };

  const loadGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
    try {
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_session_id', groupId);

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

      return members;
    } catch (error) {
      console.error('Error loading group members:', error);
      return [];
    }
  };

  const loadGroupCart = async (groupId: string): Promise<GroupCartItem[]> => {
    try {
      const { data, error } = await supabase
        .from('group_cart_items')
        .select('*')
        .eq('group_session_id', groupId);

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

      return cartItems;
    } catch (error) {
      console.error('Error loading group cart:', error);
      return [];
    }
  };

  const loadGroupPayments = async (groupId: string): Promise<GroupPayment[]> => {
    try {
      const { data, error } = await supabase
        .from('group_member_payments')
        .select('*')
        .eq('group_session_id', groupId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error loading group payments:', error);
      return [];
    }
  };

  const loadGroupSummary = async (groupId: string): Promise<GroupSummary | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_group_summary', { group_id: groupId });

      if (error) throw error;

      if (data && data.length > 0) {
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('Error loading group summary:', error);
      return null;
    }
  };

  const loadGroupPaymentSummary = async (groupId: string): Promise<GroupPaymentSummary | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_group_payment_summary', { group_id: groupId });

      if (error) throw error;

      if (data && data.length > 0) {
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('Error loading group payment summary:', error);
      return null;
    }
  };

  const loadAvailableGroups = async (): Promise<GroupSession[]> => {
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

      return groupsWithMemberCount;
    } catch (error) {
      console.error('Error loading available groups:', error);
      return [];
    }
  };

  return {
    loadUserGroup,
    loadGroupMembers,
    loadGroupCart,
    loadGroupPayments,
    loadGroupSummary,
    loadGroupPaymentSummary,
    loadAvailableGroups
  };
};
