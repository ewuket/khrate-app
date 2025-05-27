
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Plus, UserPlus } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import CreateGroupModal from "./CreateGroupModal";
import JoinGroupModal from "./JoinGroupModal";

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleAddToGroup = async () => {
    if (currentGroup) {
      await addItemToGroupCart(item);
    }
  };

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  const handleJoinGroup = () => {
    setShowJoinModal(true);
  };

  if (currentGroup) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleAddToGroup}
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
          <Button variant={variant} size={size} className={className}>
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
