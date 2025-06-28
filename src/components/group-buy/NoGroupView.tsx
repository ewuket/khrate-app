
import React from 'react';
import GroupActions from './GroupActions';
import PresetGroups from './PresetGroups';

interface NoGroupViewProps {
  onJoinGroup: () => void;
  onJoinPresetGroup: (joinCode: string) => void;
}

const NoGroupView: React.FC<NoGroupViewProps> = ({
  onJoinGroup,
  onJoinPresetGroup
}) => {
  console.log('🔍 NoGroupView rendering with props:', {
    onJoinGroup: typeof onJoinGroup,
    onJoinPresetGroup: typeof onJoinPresetGroup
  });

  return (
    <div className="space-y-12">
      <GroupActions
        onJoinGroup={onJoinGroup}
      />
      
      <PresetGroups onJoinGroup={onJoinPresetGroup} />
    </div>
  );
};

export default NoGroupView;
