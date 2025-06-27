
import React from 'react';
import AdminCustomItemCard from './AdminCustomItemCard';

interface AdminCustomItemsGridProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (itemId: number) => void;
  onToggleActive: (itemId: number, isActive: boolean) => void;
  isToggling?: boolean;
}

const AdminCustomItemsGrid = ({ 
  items, 
  onEdit, 
  onDelete, 
  onToggleActive,
  isToggling = false
}: AdminCustomItemsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <AdminCustomItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          isToggling={isToggling}
        />
      ))}
    </div>
  );
};

export default AdminCustomItemsGrid;
