
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GroupFormData } from './useAdminGroups';

export const useAdminGroupUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...groupData }: { id: string } & Partial<GroupFormData>) => {
      console.log('Updating group:', id, groupData);

      const { data: updatedGroup, error: groupError } = await supabase
        .from('group_sessions')
        .update({
          ...groupData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (groupError) {
        console.error('Error updating group:', groupError);
        throw groupError;
      }

      if (!updatedGroup) {
        throw new Error('No group was updated. Group may not exist.');
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
};
