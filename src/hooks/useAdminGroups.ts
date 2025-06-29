
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminGroupSession } from '@/types/admin';

export const useAdminGroups = () => {
  const queryClient = useQueryClient();

  const { 
    data: groups = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: async (): Promise<AdminGroupSession[]> => {
      console.log('Fetching admin groups...');
      
      try {
        // Fetch groups with optimized query
        const { data: groupsData, error: groupsError } = await supabase
          .from('group_sessions')
          .select('*')
          .order('created_at', { ascending: false });

        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
          throw new Error(`Failed to fetch groups: ${groupsError.message}`);
        }

        console.log('Successfully fetched groups:', groupsData?.length || 0);

        if (!groupsData) {
          return [];
        }

        // Get member counts for all groups in a single query
        const groupIds = groupsData.map(g => g.id);
        let memberCounts: Record<string, number> = {};
        
        if (groupIds.length > 0) {
          const { data: membersData, error: membersError } = await supabase
            .from('group_members')
            .select('group_session_id')
            .in('group_session_id', groupIds);

          if (!membersError && membersData) {
            memberCounts = membersData.reduce((acc, member) => {
              acc[member.group_session_id] = (acc[member.group_session_id] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
          }
        }

        // Combine groups with member counts and ensure items is always an array
        const groupsWithMemberCount = groupsData.map(group => ({
          ...group,
          member_count: memberCounts[group.id] || 0,
          status: group.status as 'active' | 'completed' | 'inactive',
          items: Array.isArray(group.items) ? group.items : [],
          total_amount: group.total_amount || 0
        }));

        console.log('Processed groups with member count:', groupsWithMemberCount.length);
        return groupsWithMemberCount;

      } catch (error) {
        console.error('Failed to fetch admin groups:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: Partial<AdminGroupSession>) => {
      console.log('Creating group with data:', groupData);

      // Check authentication first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const insertData = {
        name: groupData.name,
        location: groupData.location,
        region: groupData.region,
        total_amount: groupData.total_amount || 0,
        max_participants: groupData.max_participants,
        min_participants: groupData.min_participants,
        discount_percentage: groupData.discount_percentage,
        leader_id: user.id,
        join_code: Math.random().toString(36).substr(2, 6).toUpperCase(),
        is_public: groupData.is_public || true,
        is_featured: groupData.is_featured || false,
        group_type: 'public',
        status: 'active',
        admin_notes: groupData.admin_notes,
        items: groupData.items || []
      };

      console.log('Inserting group data:', insertData);

      const { data, error } = await supabase
        .from('group_sessions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating group:', error);
        throw error;
      }

      console.log('Group created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin-group-stats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      toast.success(`Group "${data.name}" created successfully!`);
    },
    onError: (error: any) => {
      console.error('Error in createGroup:', error);
      toast.error(`Failed to create group: ${error.message}`);
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async (groupData: Partial<AdminGroupSession> & { id: string }) => {
      console.log('Updating group:', groupData);
      
      const { id, ...updateData } = groupData;
      
      // Ensure items is properly formatted
      if (updateData.items) {
        updateData.items = Array.isArray(updateData.items) ? updateData.items : [];
      }
      
      const { data, error } = await supabase
        .from('group_sessions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating group:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin-group-stats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      toast.success(`Group "${data.name}" updated successfully!`);
    },
    onError: (error: any) => {
      console.error('Error updating group:', error);
      toast.error(`Failed to update group: ${error.message}`);
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      console.log('Deleting group:', groupId);
      
      const { error } = await supabase
        .from('group_sessions')
        .delete()
        .eq('id', groupId);

      if (error) {
        console.error('Error deleting group:', error);
        throw error;
      }

      return groupId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin-group-stats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      toast.success('Group deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Error deleting group:', error);
      toast.error(`Failed to delete group: ${error.message}`);
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      console.log('Toggling featured status:', { id, is_featured });
      
      const { data, error } = await supabase
        .from('group_sessions')
        .update({ is_featured })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling featured:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin-group-stats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      toast.success(`Group ${data.is_featured ? 'featured' : 'unfeatured'} successfully!`);
    },
    onError: (error: any) => {
      console.error('Error toggling featured:', error);
      toast.error(`Failed to update featured status: ${error.message}`);
    }
  });

  return {
    groups,
    isLoading,
    error,
    refetch,
    createGroup: createGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,
    toggleFeatured: toggleFeaturedMutation.mutate,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending
  };
};

export const useAdminGroupStats = () => {
  return useQuery({
    queryKey: ['admin-group-stats'],
    queryFn: async () => {
      console.log('Fetching admin group stats...');
      
      try {
        const { data, error } = await supabase
          .rpc('get_admin_group_stats');

        if (error) {
          console.error('Error fetching group stats:', error);
          throw error;
        }

        console.log('Group stats:', data);
        return data?.[0] || {
          total_groups: 0,
          active_groups: 0,
          featured_groups: 0,
          completed_groups: 0,
          total_members: 0,
          avg_group_size: 0
        };
      } catch (error) {
        console.error('Failed to fetch group stats:', error);
        // Return default values on error to prevent UI crashes
        return {
          total_groups: 0,
          active_groups: 0,
          featured_groups: 0,
          completed_groups: 0,
          total_members: 0,
          avg_group_size: 0
        };
      }
    },
    retry: 2,
    retryDelay: 1000
  });
};
