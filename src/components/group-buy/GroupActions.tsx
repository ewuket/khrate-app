
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

interface GroupActionsProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

const GroupActions = ({ onCreateGroup, onJoinGroup }: GroupActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <Button 
        className="bg-khrate-500 hover:bg-khrate-600"
        onClick={onCreateGroup}
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create New Group
      </Button>
      
      <Button 
        variant="outline"
        onClick={onJoinGroup}
        size="lg"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Join Existing Group
      </Button>
    </div>
  );
};

export default GroupActions;
