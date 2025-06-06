
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Plus, UserPlus } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateGroupModal from "./CreateGroupModal";
import JoinGroupModal from "./JoinGroupModal";
import { toast } from 'sonner';

interface GroupBuyButtonProps {
  item: any;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const GroupBuyButton: React.FC<GroupBuyButtonProps> = ({ 
  item, 
  variant = "outline", 
  size = "default",
  className = "" 
}) => {
  const { currentGroup, addItemToGroupCart } = useGroupBuying();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleAddToGroup = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (currentGroup) {
      await addItemToGroupCart(item);
    }
  };

  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setShowCreateModal(true);
  };

  const handleJoinGroup = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setShowJoinModal(true);
  };

  if (currentGroup) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          className={`${className} touch-manipulation active:scale-95 min-h-[44px]`}
          onClick={handleAddToGroup}
          style={{
            touchAction: 'manipulation',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          Add to Group
        </Button>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={`${className} touch-manipulation active:scale-95 min-h-[44px]`}
            style={{
              touchAction: 'manipulation',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Group Buy
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCreateGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Group
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleJoinGroup}>
            <UserPlus className="mr-2 h-4 w-4" />
            Join Existing Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialItem={item}
      />

      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
};

export default GroupBuyButton;
