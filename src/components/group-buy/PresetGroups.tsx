
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Percent } from "lucide-react";
import { useFeaturedGroups } from '@/hooks/useFeaturedGroups';

interface PresetGroupsProps {
  onSelectGroup: (group: any) => void;
}

const PresetGroups = ({ onSelectGroup }: PresetGroupsProps) => {
  const { data: featuredGroups = [], isLoading } = useFeaturedGroups();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Popular Group Buying Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!featuredGroups.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Popular Group Buying Sessions</h3>
        <p className="text-muted-foreground">No featured groups available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Popular Group Buying Sessions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredGroups.map((group) => (
          <Card key={group.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge variant="secondary" className="text-green-600 border-green-600">
                  <Percent className="w-3 h-3 mr-1" />
                  {group.discount_percentage}% off
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="w-3 h-3" />
                {group.location}, {group.region}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{group.member_count}/{group.max_participants} members</span>
                </div>
                <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                  {group.status}
                </Badge>
              </div>
              <Button 
                className="w-full bg-khrate-500 hover:bg-khrate-600"
                onClick={() => onSelectGroup(group)}
                disabled={group.member_count >= group.max_participants}
              >
                {group.member_count >= group.max_participants ? 'Group Full' : 'Join Group'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PresetGroups;
