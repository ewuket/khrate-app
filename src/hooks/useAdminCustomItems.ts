
import { useAdminCustomItemsQuery } from "./useAdminCustomItemsQuery";
import { useAdminCustomItemCreate } from "./useAdminCustomItemCreate";
import { useAdminCustomItemUpdate } from "./useAdminCustomItemUpdate";
import { useAdminCustomItemDelete } from "./useAdminCustomItemDelete";
import { useAdminCustomItemToggle } from "./useAdminCustomItemToggle";

export type { AdminCustomItem } from "./useAdminCustomItemsQuery";

export const useAdminCustomItems = () => {
  const { data: customItems = [], isLoading, refetch } = useAdminCustomItemsQuery();
  const createMutation = useAdminCustomItemCreate();
  const updateMutation = useAdminCustomItemUpdate();
  const deleteMutation = useAdminCustomItemDelete();
  const { toggleActiveCustomItem, isToggling } = useAdminCustomItemToggle();

  return {
    customItems,
    isLoading,
    refetch,
    createCustomItem: createMutation.mutateAsync,
    updateCustomItem: updateMutation.mutateAsync,
    deleteCustomItem: deleteMutation.mutateAsync,
    toggleActiveCustomItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: !!isToggling,
  };
};
