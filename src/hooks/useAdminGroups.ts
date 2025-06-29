
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminGroupSession, GroupStats } from '@/types/admin';

export interface GroupFormData {
  name: string;
  min_participants: number;
  max_participants: number;
  discount_percentage: number;
  location?: string;
  region?: string;
  is_public: boolean;
  is_featured: boolean;
  items?: any[];
  admin_notes?: string;
  total_amount?: number;
}

export const useAdminGroups = () => {
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    error,
    refetch: fetchGroups
  } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: async (): Promise<AdminGroupSession[]> => {
      console.log('Fetching groups for admin...');

      try {
        const { data: groupsData, error: groupsError } = await supabase
          .from('group_sessions')
          .select(`
            *,
            group_members!group_members_group_session_id_fkey(count)
          `)
          .order('created_at', { ascending: false });

        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
          throw new Error(`Database error: ${groupsError.message}`);
        }

        console.log('Successfully fetched groups:', groupsData?.length || 0);
        
        if (!groupsData || groupsData.length === 0) {
          console.warn('No groups found in database');
          return [];
        }

        const transformedGroups = groupsData.map(group => ({
          ...group,
          member_count: group.group_members?.[0]?.count || 0,
          // Handle total_amount properly - it may not exist in database yet
          total_amount: group.total_amount || 0
        }));

        return transformedGroups;
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  const {
    data: groupStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['admin-group-stats'],
    queryFn: async (): Promise<GroupStats> => {
      const { data, error } = await supabase.rpc('get_admin_group_stats');
      
      if (error) {
        console.error('Error fetching group stats:', error);
        throw error;
      }

      return data[0] || {
        total_groups: 0,
        active_groups: 0,
        featured_groups: 0,
        completed_groups: 0,
        total_members: 0,
        avg_group_size: 0
      };
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: GroupFormData) => {
      console.log('Creating group:', groupData);

      const { data: newGroup, error: groupError } = await supabase
        .from('group_sessions')
        .insert([{
          ...groupData,
          join_code: Math.random().toString(36).substr(2, 6).toUpperCase(),
          leader_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        throw groupError;
      }

      return newGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin-group-stats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      toast.success('Group created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating group:', error);
      toast.error(`Failed to create group: ${error.message}`);
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, ...groupData }: { id: string } & Partial<GroupFormData>) => {
      console.log('Updating group:', id, groupData);

      const { data: updatedGroup, error: groupError } = await supabase
        .from('group_sessions')
        .update(groupData)
        .eq('id', id)
        .select()
        .single();

      if (groupError) {
        console.error('Error updating group:', groupError);
        throw groupError;
      }

      return updatedGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
      queryClient.invalidateQueries({ queryKey: ['admin-group-stats'] });
      queryClient.invalidateQueries({ queryKey: ['featured-groups'] });
      toast.success('Group updated successfully!');
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

  return {
    groups,
    groupStats,
    isLoading,
    isLoadingStats,
    error,
    fetchGroups,
    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    isCreating: createGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending
  };
};
