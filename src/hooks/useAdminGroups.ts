
import { useAdminGroupsQuery } from "./useAdminGroupsQuery";
import { useAdminGroupStatsQuery } from "./useAdminGroupStatsQuery";
import { useAdminGroupCreate } from "./useAdminGroupCreate";
import { useAdminGroupUpdate } from "./useAdminGroupUpdate";
import { useAdminGroupDelete } from "./useAdminGroupDelete";

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
  status?: 'active' | 'inactive' | 'completed';
}

export const useAdminGroups = () => {
  const { data: groups = [], isLoading, error, refetch: fetchGroups } = useAdminGroupsQuery();
  const { data: groupStats, isLoading: isLoadingStats } = useAdminGroupStatsQuery();
  const createMutation = useAdminGroupCreate();
  const updateMutation = useAdminGroupUpdate();
  const deleteMutation = useAdminGroupDelete();

  return {
    groups,
    groupStats,
    isLoading,
    isLoadingStats,
    error,
    fetchGroups,
    createGroup: createMutation.mutateAsync,
    updateGroup: updateMutation.mutateAsync,
    deleteGroup: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
