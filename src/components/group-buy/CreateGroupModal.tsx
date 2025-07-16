
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setIsCreating(true);
    
    try {
      // This feature is not yet implemented
      toast.info('Group creation feature coming soon!');
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setGroupName('');
      setIsPublic(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              disabled={isCreating}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isCreating}
            />
            <Label htmlFor="isPublic">Make group public</Label>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Group Settings:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Minimum 3 participants required</li>
              <li>Maximum 10 participants allowed</li>
              <li>10% discount when minimum reached</li>
              <li>{isPublic ? 'Anyone can join this group' : 'Private group - join code required'}</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !groupName.trim()}
              className="flex-1 bg-khrate-500 hover:bg-khrate-600"
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
