import React, { useState } from 'react';
import { useAdminCustomItems } from "@/hooks/useAdminCustomItems";
import AdminCustomItemsHeader from "./AdminCustomItemsHeader";
import AdminCustomItemsGrid from "./AdminCustomItemsGrid";
import AdminCustomItemsLoadingState from "./AdminCustomItemsLoadingState";
import AdminCustomItemsEmptyState from "./AdminCustomItemsEmptyState";
import AdminCustomItemsDebugInfo from "./AdminCustomItemsDebugInfo";
import AdminCustomItemForm from "./AdminCustomItemForm";

const AdminCustomItemsManagement = () => {
  const { 
    customItems, 
    isLoading, 
    refetch, 
    createCustomItem, 
    updateCustomItem, 
    deleteCustomItem,
    toggleActiveCustomItem,
    isToggling 
  } = useAdminCustomItems();
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        await deleteCustomItem(itemId);
        setTimeout(() => {
          refetch(); // Force refresh after deletion
        }, 1000);
      } catch (error) {
        console.error('Error deleting item:', error);
        setError(error);
      }
    }
  };

  const handleToggleActive = async (itemId, isActive) => {
    console.log('Toggling item status:', itemId, 'from', isActive, 'to', !isActive);
    try {
      setError(null);
      await toggleActiveCustomItem({ id: itemId, is_active: isActive });
      setTimeout(() => {
        refetch(); // Force refresh after toggle
      }, 1000);
    } catch (error) {
      console.error('Error toggling item status:', error);
      setError(error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (itemData) => {
    try {
      setError(null);
      if (editingItem) {
        await updateCustomItem({ id: editingItem.id, ...itemData });
      } else {
        await createCustomItem(itemData);
      }
      handleFormClose();
      setTimeout(() => {
        refetch(); // Force refresh after creation/update
      }, 1000);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error);
    }
  };

  const handleRefresh = () => {
    setError(null);
    refetch();
  };

  if (isLoading) {
    return <AdminCustomItemsLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminCustomItemsHeader
        onCreateItem={handleCreateItem}
        onRefresh={handleRefresh}
        isRefreshing={isLoading}
      />

      {/* Debug Information */}
      <AdminCustomItemsDebugInfo
        items={customItems}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
      />

      {customItems.length === 0 ? (
        <AdminCustomItemsEmptyState onCreateItem={handleCreateItem} />
      ) : (
        <AdminCustomItemsGrid
          items={customItems}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onToggleActive={handleToggleActive}
          isToggling={isToggling}
        />
      )}

      {showForm && (
        <AdminCustomItemForm
          item={editingItem}
          isOpen={showForm}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminCustomItemsManagement;
