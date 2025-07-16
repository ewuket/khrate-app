
import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminBundle } from "@/hooks/useAdminBundles";

interface AdminBundleFormHeaderProps {
  bundle?: AdminBundle | null;
}

const AdminBundleFormHeader: React.FC<AdminBundleFormHeaderProps> = ({ bundle }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {bundle ? 'Edit Bundle' : 'Create New Bundle'}
      </DialogTitle>
    </DialogHeader>
  );
};

export default AdminBundleFormHeader;
