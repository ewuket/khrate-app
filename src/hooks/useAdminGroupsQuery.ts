
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminGroupSession } from '@/types/admin';

export const useAdminGroupsQuery = () => {
  return useQuery({
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

        const transformedGroups: AdminGroupSession[] = groupsData.map(group => ({
          id: group.id,
          name: group.name,
          join_code: group.join_code,
          leader_id: group.leader_id,
          min_participants: group.min_participants,
          max_participants: group.max_participants,
          discount_percentage: group.discount_percentage,
          status: (group.status as 'active' | 'inactive' | 'completed') || 'active',
          order_status: group.order_status,
          created_at: group.created_at,
          updated_at: group.updated_at,
          group_type: group.group_type,
          is_public: group.is_public || false,
          is_featured: group.is_featured || false,
          location: group.location,
          region: group.region,
          featured_at: group.featured_at,
          admin_notes: group.admin_notes,
          items: group.items,
          member_count: group.group_members?.[0]?.count || 0,
          total_amount: 0 // Will be calculated from items if needed
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
};
