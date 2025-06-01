
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, initialItem }) => {
  const { createGroup, addItemToGroupCart } = useGroupBuying();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [minParticipants, setMinParticipants] = useState('3');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setIsCreating(true);
    try {
      const joinCode = await createGroup(groupName || undefined, parseInt(minParticipants));
      if (joinCode && initialItem) {
        // Add the initial item to the group cart
        await addItemToGroupCart(initialItem);
      }
      onClose();
      setGroupName('');
      setMinParticipants('3');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setMinParticipants('3');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group Buy</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName">Group Name (Optional)</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="My Group Buy"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank to use your email as the group name
            </p>
          </div>

          <div>
            <Label htmlFor="minParticipants">Minimum Participants</Label>
            <Select value={minParticipants} onValueChange={setMinParticipants}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3">3 people</SelectItem>
                <SelectItem value="4">4 people</SelectItem>
                <SelectItem value="5">5 people</SelectItem>
                <SelectItem value="6">6 people</SelectItem>
                <SelectItem value="8">8 people</SelectItem>
                <SelectItem value="10">10 people</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Group discount applies when this number is reached
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup}
            disabled={isCreating}
            className="bg-khrate-500 hover:bg-khrate-600"
          >
            {isCreating ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
