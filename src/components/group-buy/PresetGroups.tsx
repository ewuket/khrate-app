
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Tag } from "lucide-react";
import { useFeaturedGroups } from "@/hooks/useFeaturedGroups";

interface PresetGroupsProps {
  onJoinGroup: (joinCode: string) => void;
  isJoining: boolean;
}

const PresetGroups = ({ onJoinGroup, isJoining }: PresetGroupsProps) => {
  const { data: featuredGroups = [], isLoading } = useFeaturedGroups();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-khrate-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading groups...</p>
      </div>
    );
  }

  if (featuredGroups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No preset groups available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

            <Button
              onClick={() => onJoinGroup(group.join_code)}
              disabled={isJoining}
              className="w-full bg-khrate-500 hover:bg-khrate-600"
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PresetGroups;
