
import PresetGroups from "@/components/group-buy/PresetGroups";
import HowItWorks from "./HowItWorks";
import GroupActions from "./GroupActions";
import GroupBuyFeatures from "./GroupBuyFeatures";

interface NoGroupViewProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onJoinPresetGroup: (groupId: string) => void;
}

const NoGroupView = ({ onCreateGroup, onJoinGroup, onJoinPresetGroup }: NoGroupViewProps) => {
  return (
    <>
      <PresetGroups onJoinGroup={onJoinPresetGroup} />

      <div className="my-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or create your own</span>
          </div>
        </div>
      </div>

      <HowItWorks />
      <GroupActions onCreateGroup={onCreateGroup} onJoinGroup={onJoinGroup} />
      <GroupBuyFeatures />
    </>
  );
};

export default NoGroupView;
