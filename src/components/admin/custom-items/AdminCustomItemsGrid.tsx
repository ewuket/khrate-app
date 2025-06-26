
import React from 'react';
import { AdminCustomItem } from "@/hooks/useAdminCustomItems";
import AdminCustomItemCard from "./AdminCustomItemCard";

interface AdminCustomItemsGridProps {
  items: AdminCustomItem[];
  onEdit: (item: AdminCustomItem) => void;
  onDelete: (itemId: number) => void;
  onToggleActive: (itemId: number, isActive: boolean) => void;
}

const AdminCustomItemsGrid: React.FC<AdminCustomItemsGridProps> = ({
  items,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <AdminCustomItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default AdminCustomItemsGrid;
