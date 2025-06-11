
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { toast } from 'sonner';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose }) => {
  const { joinGroup } = useGroupBuying();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }

    setIsJoining(true);
    
    try {
      const group = await joinGroup(joinCode.trim().toUpperCase());
      
      if (group) {
        setJoinCode('');
        onClose();
        toast.success(`Successfully joined "${group.name}"!`);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please check the code.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleClose = () => {
    if (!isJoining) {
      setJoinCode('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Existing Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="joinCode">Group Join Code</Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              disabled={isJoining}
              required
              className="font-mono text-center text-lg tracking-wider"
            />
            <p className="text-sm text-gray-500">
              Ask the group creator for the 6-character join code
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isJoining}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isJoining || !joinCode.trim()}
              className="flex-1 bg-khrate-500 hover:bg-khrate-600"
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
