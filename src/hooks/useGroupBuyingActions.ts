
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroupSession } from "@/types/groupBuying";

interface User {
  id: string;
  email?: string;
}

export const useGroupBuyingActions = () => {
  const createGroup = async (
    user: User | null,
    isAuthenticated: boolean,
    groupData: {
      name: string;
      min_participants?: number;
      max_participants?: number;
      discount_percentage?: number;
      is_public?: boolean;
      group_type?: string;
      items?: any[];
    }
  ): Promise<GroupSession | null> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create a group');
      return null;
    }

    try {
      console.log('Starting group creation process...');
      
      // Generate join code first
      const { data: joinCodeData, error: joinCodeError } = await supabase
        .rpc('generate_join_code');

      if (joinCodeError) {
        console.error('Error generating join code:', joinCodeError);
        throw new Error('Failed to generate join code');
      }

      console.log('Generated join code:', joinCodeData);

      // Create the group session with fixed constraints
      const groupInsertData = {
        name: groupData.name || `${user.email?.split('@')[0]}'s Group`,
        join_code: joinCodeData,
        leader_id: user.id,
        min_participants: 3, // Fixed to 3 as per requirements
        max_participants: 10, // Fixed to 10 as per requirements
        discount_percentage: 10, // Fixed admin-controlled discount
        status: 'active',
        order_status: 'collecting',
        is_public: groupData.is_public || false,
        group_type: groupData.group_type || 'private',
        items: groupData.items || []
      };

      console.log('Creating group with data:', groupInsertData);

      const { data: createdGroup, error: groupError } = await supabase
        .from('group_sessions')
        .insert(groupInsertData)
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        throw new Error(`Failed to create group: ${groupError.message}`);
      }

      console.log('Group created successfully:', createdGroup);

      // Add the creator as the first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_session_id: createdGroup.id,
          user_id: user.id
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        throw new Error(`Failed to add creator as member: ${memberError.message}`);
      }

      console.log('Creator added as member successfully');

      toast.success(`Group created successfully! Share code: ${joinCodeData}`, {
        duration: 5000,
        description: 'Share this code with others to let them join your group'
      });
      
      return createdGroup;
    } catch (error: any) {
      console.error('Error in createGroup:', error);
      toast.error(error.message || 'Failed to create group');
      return null;
    }
  };

  const joinGroup = async (
    user: User | null,
    isAuthenticated: boolean,
    joinCode: string
  ): Promise<GroupSession | null> => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to join a group');
      return null;
    }

    try {
      console.log('Attempting to join group with code:', joinCode);

      // Find the group by join code
      const { data: groupData, error: groupError } = await supabase
        .from('group_sessions')
        .select('*')
        .eq('join_code', joinCode.toUpperCase())
        .eq('status', 'active')
        .single();

      if (groupError) {
        console.error('Error finding group:', groupError);
        throw new Error('Group not found or inactive');
      }

      console.log('Found group:', groupData);

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_session_id', groupData.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.info('You are already a member of this group');
        return groupData;
      }

      // Add user as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_session_id: groupData.id,
          user_id: user.id
        });

      if (memberError) {
        console.error('Error adding member:', memberError);
        throw new Error(`Failed to join group: ${memberError.message}`);
      }

      console.log('Successfully joined group');
      toast.success(`Joined group "${groupData.name}"!`);
      return groupData;
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || 'Failed to join group. Please check the code.');
      return null;
    }
  };

  const leaveGroup = async (user: User | null, currentGroup: GroupSession | null) => {
    if (!currentGroup || !user) return;

    try {
      await supabase
        .from('group_members')
        .delete()
        .eq('group_session_id', currentGroup.id)
        .eq('user_id', user.id);

      toast.info('Left the group');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const addItemToGroupCart = async (
    user: User | null,
    currentGroup: GroupSession | null,
    item: any
  ) => {
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

      toast.success(`${item.name || item.title} added to group cart`);
    } catch (error) {
      console.error('Error adding to group cart:', error);
      toast.error('Failed to add item to group cart');
    }
  };

  const removeItemFromGroupCart = async (user: User | null, id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.info('Item removed from group cart');
    } catch (error) {
      console.error('Error removing from group cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const updateGroupCartItemQuantity = async (
    user: User | null,
    id: string,
    quantity: number
  ) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItemFromGroupCart(user, id);
      return;
    }

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearGroupCart = async (user: User | null, currentGroup: GroupSession | null) => {
    if (!user || !currentGroup) return;

    try {
      const { error } = await supabase
        .from('group_cart_items')
        .delete()
        .eq('group_session_id', currentGroup.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.info('Group cart cleared');
    } catch (error) {
      console.error('Error clearing group cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const completeGroupPayment = async (
    user: User | null,
    currentGroup: GroupSession | null,
    groupCart: any[],
    groupSummary: any
  ): Promise<boolean> => {
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

      toast.success('Payment completed successfully!');
      return true;
    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error('Failed to complete payment');
      return false;
    }
  };

  const completeGroupOrder = async (
    user: User | null,
    currentGroup: GroupSession | null,
    groupPaymentSummary: any
  ): Promise<boolean> => {
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
      return true;
    } catch (error) {
      console.error('Error completing group order:', error);
      toast.error('Failed to complete group order');
      return false;
    }
  };

  return {
    createGroup,
    joinGroup,
    leaveGroup,
    addItemToGroupCart,
    removeItemFromGroupCart,
    updateGroupCartItemQuantity,
    clearGroupCart,
    completeGroupPayment,
    completeGroupOrder
  };
};
