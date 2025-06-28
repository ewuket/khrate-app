
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface GroupActionsProps {
  onJoinGroup: () => void;
}

const GroupActions = ({ onJoinGroup }: GroupActionsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <Button 
        className="bg-khrate-500 hover:bg-khrate-600"
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
