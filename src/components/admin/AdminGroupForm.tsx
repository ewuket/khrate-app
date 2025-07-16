
import React, { useState, useEffect } from 'react';
import { AdminGroupSession } from "@/types/admin";
import { GroupFormData } from "@/hooks/useAdminGroups";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminGroupFormProps {
  group?: AdminGroupSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormData | (Partial<GroupFormData> & { id: string })) => void;
}

const AdminGroupForm: React.FC<AdminGroupFormProps> = ({
  group,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    min_participants: 3,
    max_participants: 10,
    discount_percentage: 10,
    location: '',
    region: '',
    is_public: false,
    is_featured: false,
    admin_notes: '',
    status: 'active'
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        min_participants: group.min_participants,
        max_participants: group.max_participants,
        discount_percentage: group.discount_percentage,
        location: group.location || '',
        region: group.region || '',
        is_public: group.is_public,
        is_featured: group.is_featured,
        admin_notes: group.admin_notes || '',
        status: group.status
      });
    } else {
      setFormData({
        name: '',
        min_participants: 3,
        max_participants: 10,
        discount_percentage: 10,
        location: '',
        region: '',
        is_public: false,
        is_featured: false,
        admin_notes: '',
        status: 'active'
      });
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (group) {
      onSubmit({ id: group.id, ...formData });
    } else {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof GroupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {group ? 'Edit Group' : 'Create New Group'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_participants">Min Participants</Label>
              <Input
                id="min_participants"
                type="number"
                min="2"
                value={formData.min_participants}
                onChange={(e) => handleInputChange('min_participants', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                min="3"
                value={formData.max_participants}
                onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount_percentage">Discount %</Label>
              <Input
                id="discount_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => handleInputChange('discount_percentage', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="Enter region"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_public">Public Group</Label>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(value) => handleInputChange('is_public', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="is_featured">Featured Group</Label>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(value) => handleInputChange('is_featured', value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_notes">Admin Notes</Label>
            <Textarea
              id="admin_notes"
              value={formData.admin_notes}
              onChange={(e) => handleInputChange('admin_notes', e.target.value)}
              placeholder="Internal notes for admin use"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-khrate-500 hover:bg-khrate-600">
              {group ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGroupForm;
