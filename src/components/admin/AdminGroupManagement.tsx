
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAdminGroups } from '@/hooks/useAdminGroups';
import { AdminGroupSession } from '@/types/admin';

interface GroupItem {
  name: string;
  quantity: number;
  unit: string;
}

const AdminGroupManagement = () => {
  const { groups, isLoading, createGroup, updateGroup, deleteGroup } = useAdminGroups();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AdminGroupSession | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    region: '',
    price: 0,
    discount_percentage: 10,
    min_participants: 3,
    max_participants: 10,
    admin_notes: '',
    is_public: false,
    is_featured: false,
    items: [] as GroupItem[]
  });

  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: 1,
    unit: 'kg'
  });

  useEffect(() => {
    if (editingGroup) {
      setFormData({
        name: editingGroup.name || '',
        description: '',
        location: editingGroup.location || '',
        region: editingGroup.region || '',
        price: editingGroup.total_amount || 0,
        discount_percentage: editingGroup.discount_percentage,
        min_participants: editingGroup.min_participants,
        max_participants: editingGroup.max_participants,
        admin_notes: editingGroup.admin_notes || '',
        is_public: editingGroup.is_public,
        is_featured: editingGroup.is_featured,
        items: Array.isArray(editingGroup.items) ? editingGroup.items : []
      });
    }
  }, [editingGroup]);

  const handleAddItem = () => {
    if (!currentItem.name.trim()) {
      toast.error('Item name is required');
      return;
    }

    const newItem = {
      name: currentItem.name.trim(),
      quantity: currentItem.quantity,
      unit: currentItem.unit
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setCurrentItem({ name: '', quantity: 1, unit: 'kg' });
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      region: '',
      price: 0,
      discount_percentage: 10,
      min_participants: 3,
      max_participants: 10,
      admin_notes: '',
      is_public: false,
      is_featured: false,
      items: []
    });
    setCurrentItem({ name: '', quantity: 1, unit: 'kg' });
    setEditingGroup(null);
  };

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Group price is required and must be greater than 0');
      return;
    }

    try {
      const groupData = {
        name: formData.name,
        location: formData.location,
        region: formData.region,
        total_amount: formData.price,
        discount_percentage: formData.discount_percentage,
        min_participants: formData.min_participants,
        max_participants: formData.max_participants,
        is_public: formData.is_public,
        is_featured: formData.is_featured,
        admin_notes: formData.admin_notes,
        items: formData.items
      };

      await createGroup(groupData);
      resetForm();
      setShowCreateForm(false);
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(`Failed to create group: ${error.message}`);
    }
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup || !formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Group price is required and must be greater than 0');
      return;
    }

    try {
      const groupData = {
        id: editingGroup.id,
        name: formData.name,
        location: formData.location,
        region: formData.region,
        total_amount: formData.price,
        discount_percentage: formData.discount_percentage,
        min_participants: formData.min_participants,
        max_participants: formData.max_participants,
        is_public: formData.is_public,
        is_featured: formData.is_featured,
        admin_notes: formData.admin_notes,
        items: formData.items
      };

      await updateGroup(groupData);
      resetForm();
      setShowCreateForm(false);
    } catch (error: any) {
      console.error('Error updating group:', error);
      toast.error(`Failed to update group: ${error.message}`);
    }
  };

  const handleEdit = (group: AdminGroupSession) => {
    setEditingGroup(group);
    setShowCreateForm(true);
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const handleToggleStatus = async (group: AdminGroupSession) => {
    try {
      const newStatus = group.status === 'active' ? 'inactive' : 'active';
      await updateGroup({
        id: group.id,
        status: newStatus
      });
    } catch (error) {
      console.error('Error toggling group status:', error);
      toast.error('Failed to update group status');
    }
  };

  const handleToggleFeatured = async (group: AdminGroupSession) => {
    try {
      await updateGroup({
        id: group.id,
        is_featured: !group.is_featured
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    }
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
          <p className="text-muted-foreground">Create and manage group buying sessions</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-khrate-500 hover:bg-khrate-600"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</CardTitle>
            <CardDescription>
              {editingGroup ? 'Update group buying session details' : 'Set up a new group buying session'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekend Groceries"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Group Price (RWF) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g., 20000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Kigali City"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g., Nyarugenge"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minParticipants">Minimum Participants</Label>
                <Input
                  id="minParticipants"
                  type="number"
                  min="2"
                  value={formData.min_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_participants: parseInt(e.target.value) || 2 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 2 }))}
                />
              </div>
            </div>

            {/* Items Management Section */}
            <div className="space-y-4">
              <Label>Group Items *</Label>
              
              {/* Add Item Form */}
              <div className="flex gap-2 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Item name (e.g., Tomatoes)"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-24"
                />
                <Input
                  placeholder="Unit"
                  value={currentItem.unit}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-20"
                />
                <Button onClick={handleAddItem} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{item.quantity} {item.unit} of {item.name}</span>
                      <Button
                        onClick={() => handleRemoveItem(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin_notes">Admin Notes</Label>
              <Textarea
                id="admin_notes"
                value={formData.admin_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                placeholder="Internal notes about this group..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                />
                <span>Make Public</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <span>Featured Group</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                className="bg-khrate-500 hover:bg-khrate-600"
                disabled={!formData.name.trim() || formData.price <= 0 || isLoading}
              >
                {editingGroup ? 'Update Group' : 'Create Group'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setShowCreateForm(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{group.name || 'Unnamed Group'}</h3>
                    <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                      {group.status}
                    </Badge>
                    {group.is_featured && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Featured
                      </Badge>
                    )}
                    {group.is_public && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Public
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Join Code:</span>
                      <p className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{group.join_code}</p>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <p>RWF {group.total_amount?.toLocaleString() || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>
                      <p>{group.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Members:</span>
                      <p>{group.member_count || 0} / {group.max_participants}</p>
                    </div>
                    <div>
                      <span className="font-medium">Discount:</span>
                      <p>{group.discount_percentage}%</p>
                    </div>
                  </div>

                  {/* Display Items */}
                  {group.items && Array.isArray(group.items) && group.items.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium text-sm">Items:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {group.items.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item.quantity} {item.unit} {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {group.admin_notes && (
                    <div className="text-sm">
                      <span className="font-medium">Admin Notes:</span>
                      <p className="text-gray-600">{group.admin_notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(group)}
                    disabled={isLoading}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(group)}
                    disabled={isLoading}
                  >
                    {group.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(group)}
                    disabled={isLoading}
                  >
                    {group.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(group.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {groups.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No Groups Created</h3>
              <p className="text-muted-foreground mb-4">Create your first group buying session to get started.</p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminGroupManagement;
