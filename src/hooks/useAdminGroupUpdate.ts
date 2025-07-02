
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GroupFormData } from './useAdminGroups';

export const useAdminGroupUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...groupData }: { id: string } & Partial<GroupFormData>) => {
      console.log('Updating group:', id, groupData);

      if (!id) {
        throw new Error('Group ID is required for update');
      }

      // Clean the data before update - remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(groupData).filter(([_, value]) => value !== undefined)
      );

      // Add updated timestamp
      cleanData.updated_at = new Date().toISOString();

      console.log('Updating group with clean data:', cleanData);

      const { data: updatedGroup, error: groupError } = await supabase
        .from('group_sessions')
        .update(cleanData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (groupError) {
        console.error('Error updating group:', groupError);
        throw new Error(`Database error: ${groupError.message}`);
      }

      if (!updatedGroup) {
        throw new Error('Group not found or no changes were made');
      }

      console.log('Group updated successfully:', updatedGroup);
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
      toast.error(error.message || 'Failed to update group');
    }
  });
};
