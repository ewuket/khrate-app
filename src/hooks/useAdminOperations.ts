
import { useAdminBundleOperations } from "./admin/useAdminBundleOperations";
import { useAdminCustomItemOperations } from "./admin/useAdminCustomItemOperations";
import { useAdminOrderOperations } from "./admin/useAdminOrderOperations";
import { useAdminGroupOperations } from "./admin/useAdminGroupOperations";

export const useAdminOperations = () => {
  const { 
    createBundle, 
    updateBundle, 
    deleteBundle, 
    toggleBundleStatus,
    loading: bundleLoading 
  } = useAdminBundleOperations();
  
  const { 
    createCustomItem, 
    updateCustomItem, 
    deleteCustomItem, 
    toggleCustomItemStatus,
    loading: customItemLoading 
  } = useAdminCustomItemOperations();
  
  const { updateOrderStatus, updatePaymentStatus } = useAdminOrderOperations();
  const { 
    toggleGroupActive: toggleGroupActiveOriginal, 
    toggleGroupFeatured,
    isToggling: groupToggling 
  } = useAdminGroupOperations();

  // Bundle operations with proper naming
  const toggleBundleActive = async (bundleId: number, isActive: boolean) => {
    return await toggleBundleStatus(bundleId, !isActive);
  };

  const toggleBundleFeatured = async (bundleId: number, isFeatured: boolean) => {
    // For bundle featured toggle, we need to use the update method
    return await updateBundle(bundleId, { is_featured: !isFeatured });
  };

  // Custom item operations with proper naming
  const toggleCustomItemActive = async (itemId: number, isActive: boolean) => {
    return await toggleCustomItemStatus(itemId, !isActive);
  };

  // Group operations - fix the signature to match what AdminGroupManagement expects
  const toggleGroupActive = async (groupId: string, currentStatus: string) => {
    return await toggleGroupActiveOriginal(groupId, currentStatus);
  };

  // Normalize all loading states to be consistent (string | null)
  const bundleToggling = bundleLoading ? `bundle-${Math.random()}` : null;
  const customItemToggling = customItemLoading ? `custom-item-${Math.random()}` : null;
  const normalizedGroupToggling = typeof groupToggling === 'string' ? groupToggling : null;
  
  // Return the first non-null loading state, or null if none are loading
  const currentToggling = bundleToggling || customItemToggling || normalizedGroupToggling;

  return {
    // Bundle operations
    createBundle,
    updateBundle,
    deleteBundle,
    toggleBundleActive,
    toggleBundleFeatured,
    
    // Custom item operations
    createCustomItem,
    updateCustomItem,
    deleteCustomItem,
    toggleCustomItemActive,
    
    // Group operations
    toggleGroupActive,
    toggleGroupFeatured,
    
    // Order operations
    updateOrderStatus,
    updatePaymentStatus,
    
    // Loading states - ensure consistent type (string | null)
    isToggling: currentToggling
  };
};
