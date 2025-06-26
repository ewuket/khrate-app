
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminGroupSession, GroupStats } from "@/types/admin";

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
      
      const { data, error } = await supabase
        .from('group_sessions')
        .select(`
          *,
          group_members(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin groups:', error);
        throw error;
      }

      return data?.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      })) || [];
    },
    staleTime: 30 * 1000,
    retry: 2,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: Partial<AdminGroupSession>) => {
      const { data, error } = await supabase
        .from('group_sessions')
        .insert({
          name: groupData.name,
          discount_percentage: groupData.discount_percentage || 10,
          min_participants: groupData.min_participants || 3,
          max_participants: groupData.max_participants || 10,
          status: groupData.status || 'active',
          join_code: generateJoinCode(),
          leader_id: groupData.leader_id,
          location: groupData.location,
          region: groupData.region,
          is_featured: groupData.is_featured || false,
          admin_notes: groupData.admin_notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      toast.success('Group created successfully!');
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AdminGroupSession> & { id: string }) => {
      const { data, error } = await supabase
        .from('group_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      toast.success('Group updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('group_sessions')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      toast.success('Group deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { data, error } = await supabase
        .from('group_sessions')
        .update({ is_featured })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      toast.success(data.is_featured ? 'Group featured successfully!' : 'Group unfeatured successfully!');
    },
    onError: (error) => {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
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
    isDeleting: deleteGroupMutation.isPending,
  };
};

export const useAdminGroupStats = () => {
  return useQuery({
    queryKey: ['admin-group-stats'],
    queryFn: async (): Promise<GroupStats> => {
      const { data, error } = await supabase
        .rpc('get_admin_group_stats');

      if (error) {
        console.error('Error fetching group stats:', error);
        throw error;
      }

      return data?.[0] || {
        total_groups: 0,
        active_groups: 0,
        featured_groups: 0,
        completed_groups: 0,
        total_members: 0,
        avg_group_size: 0
      };
    },
    staleTime: 60 * 1000,
    retry: 2,
  });
};

const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
