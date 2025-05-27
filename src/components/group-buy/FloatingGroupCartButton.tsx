
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart } from "lucide-react";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";
import GroupCartSidebar from "./GroupCartSidebar";

const FloatingGroupCartButton: React.FC = () => {
  const { currentGroup, groupCartItems, groupMembers } = useGroupBuying();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentGroup) return null;

  const itemCount = groupCartItems.length;
  const memberCount = groupMembers.length;

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-khrate-500 hover:bg-khrate-600 shadow-lg"
          size="icon"
        >
          <div className="relative">
            <Users className="h-6 w-6" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </div>
        </Button>
        
        <div className="mt-2 text-center">
          <div className="bg-white rounded-lg shadow px-2 py-1 text-xs">
            <p className="font-medium">Group Cart</p>
            <p className="text-muted-foreground">{memberCount} members</p>
          </div>
        </div>
      </div>

      <GroupCartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingGroupCartButton;
