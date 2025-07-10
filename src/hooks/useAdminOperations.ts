
import { useAdminBundleOperations } from "./admin/useAdminBundleOperations";
import { useAdminCustomItemOperations } from "./admin/useAdminCustomItemOperations";
import { useAdminOrderOperations } from "./admin/useAdminOrderOperations";
import { useAdminGroupOperations } from "./admin/useAdminGroupOperations";

export const useAdminOperations = () => {
  const { toggleBundleActive, toggleBundleFeatured, isToggling: bundleToggling } = useAdminBundleOperations();
  const { toggleCustomItemActive, isToggling: customItemToggling } = useAdminCustomItemOperations();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOrderOperations();
  const { toggleGroupActive, toggleGroupFeatured, isToggling: groupToggling } = useAdminGroupOperations();

  return {
    // Bundle operations
    toggleBundleActive,
    toggleBundleFeatured,
    
    // Custom item operations
    toggleCustomItemActive,
    
    // Group operations
    toggleGroupActive,
    toggleGroupFeatured,
    
    // Order operations
    updateOrderStatus,
    updatePaymentStatus,
    
    // Loading states
    isToggling: bundleToggling || customItemToggling || groupToggling
  };
};
