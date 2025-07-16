
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminGroupDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
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
};
