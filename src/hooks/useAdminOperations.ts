
import { useAdminBundleOperations } from "./admin/useAdminBundleOperations";
import { useAdminCustomItemOperations } from "./admin/useAdminCustomItemOperations";
import { useAdminOrderOperations } from "./admin/useAdminOrderOperations";

export const useAdminOperations = () => {
  const { toggleBundleActive, toggleBundleFeatured, isToggling: bundleToggling } = useAdminBundleOperations();
  const { toggleCustomItemActive, isToggling: customItemToggling } = useAdminCustomItemOperations();
  const { updateOrderStatus, updatePaymentStatus } = useAdminOrderOperations();

  return {
    // Bundle operations
    toggleBundleActive,
    toggleBundleFeatured,
    
    // Custom item operations
    toggleCustomItemActive,
    
    // Order operations
    updateOrderStatus,
    updatePaymentStatus,
    
    // Loading states
    isToggling: bundleToggling || customItemToggling
  };
};
