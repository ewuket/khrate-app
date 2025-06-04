
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import GroupJoinSuccessModal from './GroupJoinSuccessModal';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ isOpen, onClose }) => {
  const { joinGroup, currentGroup, groupMembers } = useGroupBuying();
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;
    
    setIsJoining(true);
    try {
      const success = await joinGroup(joinCode.trim().toUpperCase());
      if (success) {
        setJoinCode('');
        onClose();
        setShowSuccessModal(true);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleClose = () => {
    setJoinCode('');
    onClose();
  };

  const handleCheckout = () => {
    setShowSuccessModal(false);
    // This will trigger the group cart to open
    window.dispatchEvent(new CustomEvent('openGroupCart'));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Group Buy</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="joinCode">Enter Join Code</Label>
              <Input
                id="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABCD12"
                className="text-center font-mono text-lg"
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter the 6-character code shared by your group leader
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleJoinGroup}
              disabled={isJoining || !joinCode.trim()}
              className="bg-khrate-500 hover:bg-khrate-600"
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentGroup && (
        <GroupJoinSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          group={currentGroup}
          members={groupMembers}
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
};

export default JoinGroupModal;
