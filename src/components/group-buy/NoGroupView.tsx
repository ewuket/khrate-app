
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, UserPlus, Package } from "lucide-react";
import PresetGroupModal from "./PresetGroupModal";

interface NoGroupViewProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onJoinPresetGroup: (groupId: string) => void;
}

const NoGroupView: React.FC<NoGroupViewProps> = ({ 
  onCreateGroup, 
  onJoinGroup, 
  onJoinPresetGroup 
}) => {
  const [selectedPresetGroup, setSelectedPresetGroup] = useState<string | null>(null);

  const presetGroups = [
    {
      id: 'office-snacks',
      name: 'Office Snacks',
      description: 'Perfect for office break rooms and team gatherings',
      members: '3/5',
      discount: '15%',
      estimatedSavings: '5,000 RWF'
    },
    {
      id: 'family-groceries',
      name: 'Family Groceries',
      description: 'Essential groceries for families',
      members: '2/4',
      discount: '12%',
      estimatedSavings: '3,200 RWF'
    }
  ];

  const handleJoinPresetGroup = (groupId: string) => {
    setSelectedPresetGroup(groupId);
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onCreateGroup}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Group
            </CardTitle>
            <CardDescription>
              Start your own group buy with custom items and invite others to join
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-khrate-500 hover:bg-khrate-600">
              Create Group
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onJoinGroup}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Join Existing Group
            </CardTitle>
            <CardDescription>
              Have a join code? Enter it here to join an existing group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Join with Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preset Groups */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Popular Group Buys</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {presetGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-khrate-500" />
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{group.members}</Badge>
                </div>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Group Discount:</span>
                  <Badge variant="default" className="bg-green-500">{group.discount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated Savings:</span>
                  <span className="font-medium text-green-600">{group.estimatedSavings}</span>
                </div>
                <Button 
                  onClick={() => handleJoinPresetGroup(group.id)}
                  className="w-full bg-khrate-500 hover:bg-khrate-600"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View & Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedPresetGroup && (
        <PresetGroupModal
          isOpen={!!selectedPresetGroup}
          onClose={() => setSelectedPresetGroup(null)}
          groupId={selectedPresetGroup}
        />
      )}
    </div>
  );
};

export default NoGroupView;
