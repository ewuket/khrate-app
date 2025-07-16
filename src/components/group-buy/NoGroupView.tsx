
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Clock, Tag } from "lucide-react";
import { useFeaturedGroups } from "@/hooks/useFeaturedGroups";
import GroupPreviewModal from "./GroupPreviewModal";
import { useState } from "react";

interface NoGroupViewProps {
  onJoinGroup: (joinCode: string) => Promise<void>;
  isJoining: boolean;
}

const NoGroupView: React.FC<NoGroupViewProps> = ({ onJoinGroup, isJoining }) => {
  const { data: featuredGroups = [], isLoading } = useFeaturedGroups();
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewGroup = (group: any) => {
    setSelectedGroup(group);
    setShowPreview(true);
  };

  const handleJoinFromPreview = async (joinCode: string) => {
    await onJoinGroup(joinCode);
    setShowPreview(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Join a Group Buying Session</h2>
        <p className="text-gray-600 mb-8">
          Save money by joining others in bulk purchases. Browse available groups below or join with a code.
        </p>
      </div>

      {featuredGroups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="secondary" className="bg-khrate-100 text-khrate-700">
                    Featured
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {group.location || 'Location TBD'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.member_count || 0}/{group.max_participants} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {group.discount_percentage}% off
                  </span>
                </div>
                
                {group.total_amount && (
                  <div className="text-lg font-semibold text-khrate-600">
                    RWF {group.total_amount.toLocaleString()}
                  </div>
                )}

                {group.items && Array.isArray(group.items) && group.items.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {group.items.slice(0, 3).map((item: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.quantity} {item.unit} {item.name}
                        </Badge>
                      ))}
                      {group.items.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{group.items.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewGroup(group)}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                  <Button
                    onClick={() => onJoinGroup(group.join_code)}
                    disabled={isJoining}
                    className="flex-1 bg-khrate-500 hover:bg-khrate-600"
                    size="sm"
                  >
                    {isJoining ? 'Joining...' : 'Join Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Groups</h3>
            <p className="text-muted-foreground mb-4">
              There are no active group buying sessions at the moment. Check back later or contact us to start a new group.
            </p>
          </CardContent>
        </Card>
      )}

      <GroupPreviewModal
        group={selectedGroup}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onJoinGroup={handleJoinFromPreview}
        isJoining={isJoining}
      />
    </div>
  );
};

export default NoGroupView;
