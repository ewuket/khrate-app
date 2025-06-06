
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { toast } from 'sonner';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  initialItem
}) => {
  const { createGroup, addItemToGroupCart } = useGroupBuying();
  const [formData, setFormData] = useState({
    name: '',
    minParticipants: 3,
    maxParticipants: 10,
    discountPercentage: 10,
    isPublic: false
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setIsCreating(true);
    try {
      const group = await createGroup({
        name: formData.name,
        min_participants: formData.minParticipants,
        max_participants: formData.maxParticipants,
        discount_percentage: formData.discountPercentage,
        is_public: formData.isPublic,
        group_type: formData.isPublic ? 'public' : 'private'
      });

      if (group && initialItem) {
        await addItemToGroupCart(initialItem);
      }

      onClose();
      setFormData({
        name: '',
        minParticipants: 3,
        maxParticipants: 10,
        discountPercentage: 10,
        isPublic: false
      });
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Neighborhood Group"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minParticipants">Min. Participants</Label>
              <Input
                id="minParticipants"
                type="number"
                min="2"
                max="20"
                value={formData.minParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, minParticipants: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max. Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="3"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPercentage">Group Discount (%)</Label>
            <Input
              id="discountPercentage"
              type="number"
              min="5"
              max="30"
              value={formData.discountPercentage}
              onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: Number(e.target.value) }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
            <Label htmlFor="isPublic">Make group public (others can find and join)</Label>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
