
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { toast } from "sonner";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { createGroup } = useGroupBuying();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setIsCreating(true);
    try {
      const group = await createGroup({
        name: groupName.trim(),
        min_participants: 3, // Fixed to 3
        max_participants: 10, // Fixed to 10
        is_public: isPublic,
        group_type: isPublic ? 'public' : 'private'
      });
      
      if (group) {
        onClose();
        setGroupName('');
        setIsPublic(false);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Create New Group</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              type="text"
              placeholder="e.g., Weekend Groceries"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Group Settings</Label>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Minimum participants: 3 (required for discount)</p>
              <p>Maximum participants: 10</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic">Make group public</Label>
              <p className="text-sm text-gray-600">
                {isPublic ? 'Anyone can find and join this group' : 'Share a join code to invite members'}
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-khrate-500 hover:bg-khrate-600 text-white"
            disabled={isCreating}
          >
            {isCreating ? 'Creating Group...' : 'Create Group'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
