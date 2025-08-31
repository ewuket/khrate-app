
import { useAdminOrderOperations } from './admin/useAdminOrderOperations';
import { useAdminBundleOperations } from './admin/useAdminBundleOperations';
import { useAdminGroupOperations } from './admin/useAdminGroupOperations';
import { useAdminCustomItemOperations } from './admin/useAdminCustomItemOperations';

export const useAdminOperations = () => {
  try {
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
  } catch (error) {
    console.error('❌ Error initializing admin operations:', error);
    return {
      updateOrderStatus: async () => false,
      updatePaymentStatus: async () => false,
      toggleBundleActive: async () => false,
      toggleBundleFeatured: async () => false,
      toggleGroupActive: async () => false,
      toggleGroupFeatured: async () => false,
      toggleCustomItemActive: async () => false,
      isToggling: false
    };
  }
};
