
import React from 'react';
import GroupActions from './GroupActions';
import PresetGroups from './PresetGroups';

interface NoGroupViewProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onJoinPresetGroup: (joinCode: string) => void;
}

const NoGroupView: React.FC<NoGroupViewProps> = ({
  onCreateGroup,
  onJoinGroup,
  onJoinPresetGroup
}) => {
  console.log('🔍 NoGroupView rendering with props:', {
    onCreateGroup: typeof onCreateGroup,
    onJoinGroup: typeof onJoinGroup,
    onJoinPresetGroup: typeof onJoinPresetGroup
  });

  return (
    <div className="space-y-12">
      <GroupActions
        onCreateGroup={onCreateGroup}
        onJoinGroup={onJoinGroup}
      />
      
      <PresetGroups onJoinGroup={onJoinPresetGroup} />
    </div>
  );
};

export default NoGroupView;
