
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GroupFormData } from './useAdminGroups';

export const useAdminGroupCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
        .maybeSingle();

      if (groupError) {
        console.error('Error creating group:', groupError);
        throw groupError;
      }

      if (!newGroup) {
        throw new Error('No group was created');
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
};
