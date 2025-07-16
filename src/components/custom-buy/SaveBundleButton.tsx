
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface SaveBundleButtonProps {
  bundleId: number;
  onSaveBundle: () => void;
}

export const SaveBundleButton: React.FC<SaveBundleButtonProps> = ({ 
  bundleId, 
  onSaveBundle 
}) => {
  return (
    <Button 
      variant="outline" 
      className="w-full"
      onClick={onSaveBundle}
    >
      <Heart className="mr-2 h-4 w-4" />
      Save Bundle
    </Button>
  );
};
