
import GroupActions from "./GroupActions";
import PresetGroups from "./PresetGroups";
import PopularGroupBuys from "@/components/home/PopularGroupBuys";

interface NoGroupViewProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onJoinPresetGroup: (groupId: string) => void;
}

const NoGroupView = ({ onCreateGroup, onJoinGroup, onJoinPresetGroup }: NoGroupViewProps) => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join or Create a Group</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Team up with others to unlock group discounts and save money on your grocery shopping.
        </p>
      </div>

      <GroupActions 
        onCreateGroup={onCreateGroup}
        onJoinGroup={onJoinGroup}
      />

      <PresetGroups onJoinGroup={onJoinPresetGroup} />

      {/* Popular Group Buys section */}
      <div className="mt-16">
        <PopularGroupBuys />
      </div>
    </div>
  );
};

export default NoGroupView;
