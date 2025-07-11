
import React, { useState } from 'react';
import { useAdminGroups, GroupFormData } from "@/hooks/useAdminGroups";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Users } from "lucide-react";
import { AdminGroupSession } from "@/types/admin";
import AdminGroupCard from "./AdminGroupCard";
import AdminGroupForm from "./AdminGroupForm";
import AdminGroupDebugInfo from "./group-management/AdminGroupDebugInfo";

const AdminGroupManagement = () => {
  const { 
    groups, 
    isLoading, 
    error,
    fetchGroups, 
    createGroup, 
    updateGroup, 
    deleteGroup 
  } = useAdminGroups();
  
  const { toggleGroupActive, toggleGroupFeatured, isToggling } = useAdminOperations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AdminGroupSession | null>(null);

  const handleCreateGroup = async (groupData: GroupFormData) => {
    try {
      await createGroup(groupData);
      setShowForm(false);
      setTimeout(() => {
        fetchGroups(); // Force refresh after creation
      }, 1000);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleUpdateGroup = async (groupData: Partial<GroupFormData> & { id: string }) => {
    try {
      await updateGroup(groupData);
      setShowForm(false);
      setEditingGroup(null);
      setTimeout(() => {
        fetchGroups(); // Force refresh after update
      }, 1000);
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleEdit = (group: AdminGroupSession) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleDelete = async (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await deleteGroup(groupId);
        setTimeout(() => {
          fetchGroups(); // Force refresh after deletion
        }, 1000);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleToggleActive = async (groupId: string, currentStatus: string) => {
    try {
      await toggleGroupActive(groupId, currentStatus);
      setTimeout(() => {
        fetchGroups(); // Force refresh after toggle
      }, 1000);
    } catch (error) {
      console.error('Error toggling group status:', error);
    }
  };

  const handleToggleFeatured = async (groupId: string, isFeatured: boolean) => {
    try {
      await toggleGroupFeatured(groupId, isFeatured);
      setTimeout(() => {
        fetchGroups(); // Force refresh after toggle
      }, 1000);
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGroup(null);
  };

  const handleRefresh = () => {
    console.log('Refreshing groups...');
    fetchGroups();
  };

  const handleCreateGroupClick = () => {
    setEditingGroup(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Group Management</h2>
          <p className="text-gray-600">Manage group buying sessions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateGroupClick}
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        </div>
      </div>

      {/* Debug Information */}
      <AdminGroupDebugInfo
        groups={groups}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
      />

      {!groups || groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No groups found</p>
          <Button 
            onClick={handleCreateGroupClick} 
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Group
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <AdminGroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onToggleFeatured={handleToggleFeatured}
              isToggling={isToggling}
            />
          ))}
        </div>
      )}

      {showForm && (
        <AdminGroupForm
          group={editingGroup}
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
        />
      )}
    </div>
  );
};

export default AdminGroupManagement;
