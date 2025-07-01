
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
      console.log('Fetching admin custom items...');
      
      const { data, error } = await supabase
        .from('custom_buy_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom items:', error);
        throw error;
      }

      console.log('Admin custom items fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 30 * 1000,
    retry: 2,
  });
};
