
import React from 'react';
import { Button } from "@/components/ui/button";
import { AdminBundle } from "@/hooks/useAdminBundles";

interface AdminBundleFormActionsProps {
  bundle?: AdminBundle | null;
  onClose: () => void;
}

const AdminBundleFormActions: React.FC<AdminBundleFormActionsProps> = ({
  bundle,
  onClose
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" className="bg-khrate-500 hover:bg-khrate-600">
        {bundle ? 'Update Bundle' : 'Create Bundle'}
      </Button>
    </div>
  );
};

export default AdminBundleFormActions;
