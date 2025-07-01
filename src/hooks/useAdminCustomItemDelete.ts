
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminCustomItemDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: number) => {
      const { error } = await supabase
        .from('custom_buy_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting custom item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-items'] });
      toast.success('Custom item deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting custom item:', error);
      toast.error('Failed to delete custom item');
    }
  });
};
