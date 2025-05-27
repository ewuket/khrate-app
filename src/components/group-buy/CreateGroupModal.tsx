
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { Copy, Users } from "lucide-react";
import { toast } from "sonner";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: any;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, initialItem }) => {
  const { createGroup, addItemToGroupCart } = useGroupBuying();
  const [groupName, setGroupName] = useState('');
  const [minParticipants, setMinParticipants] = useState(3);
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateGroup = async () => {
    setIsCreating(true);
    try {
      const code = await createGroup(groupName || undefined, minParticipants);
      if (code) {
        setJoinCode(code);
        setIsCreated(true);
        
        // Add initial item if provided
        if (initialItem) {
          await addItemToGroupCart(initialItem);
        }
      }
    } finally {
      setIsCreating(false);
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success('Join code copied to clipboard!');
  };

  const handleClose = () => {
    setGroupName('');
    setMinParticipants(3);
    setJoinCode('');
    setIsCreated(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreated ? 'Group Created!' : 'Create Group Buy'}
          </DialogTitle>
        </DialogHeader>

        {!isCreated ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">Group Name (Optional)</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Friends Grocery Run"
              />
            </div>

            <div>
              <Label htmlFor="minParticipants">Minimum Participants</Label>
              <Input
                id="minParticipants"
                type="number"
                min={2}
                max={10}
                value={minParticipants}
                onChange={(e) => setMinParticipants(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum number of people needed to unlock group discounts
              </p>
            </div>

            {initialItem && (
              <div className="bg-khrate-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Starting with:</p>
                <p className="text-sm text-muted-foreground">{initialItem.name}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Your group is ready!</h3>
              <div className="bg-white p-3 rounded border-2 border-dashed border-green-300">
                <p className="text-sm text-muted-foreground mb-1">Share this join code:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-lg font-mono font-bold">{joinCode}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyJoinCode}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Waiting for {minParticipants - 1} more members to join</span>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isCreated ? (
            <>
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
            </>
          ) : (
            <Button onClick={handleClose} className="bg-khrate-500 hover:bg-khrate-600">
              Continue Shopping
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
