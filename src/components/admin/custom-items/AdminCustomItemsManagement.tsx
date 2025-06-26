
import React, { useState } from 'react';
import { useAdminCustomItems } from "@/hooks/useAdminCustomItems";
import AdminCustomItemsHeader from "./AdminCustomItemsHeader";
import AdminCustomItemsGrid from "./AdminCustomItemsGrid";
import AdminCustomItemsLoadingState from "./AdminCustomItemsLoadingState";
import AdminCustomItemsEmptyState from "./AdminCustomItemsEmptyState";
import AdminCustomItemForm from "./AdminCustomItemForm";

const AdminCustomItemsManagement = () => {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem, toggleActive } = useAdminCustomItems();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
      await deleteItem(itemId);
    }
  };

  const handleToggleActive = async (itemId, isActive) => {
    await toggleActive(itemId, isActive);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (itemData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemData);
      } else {
        await createItem(itemData);
      }
      handleFormClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (loading) {
    return <AdminCustomItemsLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AdminCustomItemsHeader
        onCreateItem={handleCreateItem}
        onRefresh={fetchItems}
        isRefreshing={loading}
      />

      {items.length === 0 ? (
        <AdminCustomItemsEmptyState onCreateItem={handleCreateItem} />
      ) : (
        <AdminCustomItemsGrid
          items={items}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onToggleActive={handleToggleActive}
        />
      )}

      {showForm && (
        <AdminCustomItemForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminCustomItemsManagement;
