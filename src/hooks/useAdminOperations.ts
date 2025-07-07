
import { useAdminOrderOperations } from './admin/useAdminOrderOperations';
import { useAdminBundleOperations } from './admin/useAdminBundleOperations';
import { useAdminGroupOperations } from './admin/useAdminGroupOperations';
import { useAdminCustomItemOperations } from './admin/useAdminCustomItemOperations';

export const useAdminOperations = () => {
  const orderOperations = useAdminOrderOperations();
  const bundleOperations = useAdminBundleOperations();
  const groupOperations = useAdminGroupOperations();
  const customItemOperations = useAdminCustomItemOperations();

  // Combine isToggling states from all operations
  const isToggling = bundleOperations.isToggling || 
                    groupOperations.isToggling || 
                    customItemOperations.isToggling;

  return {
    // Order operations
    updateOrderStatus: orderOperations.updateOrderStatus,
    updatePaymentStatus: orderOperations.updatePaymentStatus,
    
    // Bundle operations
    toggleBundleActive: bundleOperations.toggleBundleActive,
    toggleBundleFeatured: bundleOperations.toggleBundleFeatured,
    
    // Group operations
    toggleGroupActive: groupOperations.toggleGroupActive,
    toggleGroupFeatured: groupOperations.toggleGroupFeatured,
    
    // Custom item operations
    toggleCustomItemActive: customItemOperations.toggleCustomItemActive,
    
    // Combined state
    isToggling
  };
};
