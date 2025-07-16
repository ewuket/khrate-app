
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminCustomItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image_url: string;
  description: string | null;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export const useAdminCustomItemsQuery = () => {
  return useQuery({
    queryKey: ['admin-custom-items'],
    queryFn: async () => {
      console.log('🔄 Fetching ALL custom items for admin (active and inactive)...');
      
      // Test admin authentication first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Check admin status
      const { data: adminCheck } = await supabase.rpc('is_admin_user');
      console.log('🔍 Admin check result:', adminCheck);
      
      if (!adminCheck) {
        throw new Error('Admin access required');
      }

      try {
        // Admin should see ALL items (both active and inactive)
        const { data, error } = await supabase
          .from('custom_buy_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching custom items:', error);
          throw error;
        }

        console.log('✅ Admin custom items fetched:', data?.length || 0);
        console.log('📊 Items breakdown:', {
          total: data?.length || 0,
          active: data?.filter(item => item.is_active).length || 0,
          inactive: data?.filter(item => !item.is_active).length || 0
        });

        return data || [];
      } catch (error) {
        console.error('❌ Failed to fetch custom items:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000,
    retry: 2,
  });
};
