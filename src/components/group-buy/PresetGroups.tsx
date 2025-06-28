
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Percent, Calendar } from "lucide-react";
import { useFeaturedGroups } from "@/hooks/useFeaturedGroups";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

interface PresetGroupsProps {
  onJoinGroup: (groupId: string) => void;
}

const PresetGroups: React.FC<PresetGroupsProps> = ({ onJoinGroup }) => {
  const { featuredGroups, loading, error, refetch } = useFeaturedGroups();

  console.log('🏠 PresetGroups component render state:', {
    featuredGroupsCount: featuredGroups?.length,
    loading,
    error,
    featuredGroups: featuredGroups?.slice(0, 2) // Log first 2 for debugging
  });

  if (error) {
    console.error('❌ PresetGroups - Error state:', error);
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Active Groups</h2>
          <p className="text-gray-600">Connect with others in your area for group buying discounts</p>
        </div>
        
        <div className="max-w-md mx-auto text-center">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load groups: {error}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={refetch} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('⏳ PresetGroups - Loading state');
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Active Groups</h2>
          <p className="text-gray-600">Connect with others in your area for group buying discounts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!featuredGroups || featuredGroups.length === 0) {
    console.log('📭 PresetGroups - No featured groups found');
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Active Groups</h2>
          <p className="text-gray-600">Connect with others in your area for group buying discounts</p>
        </div>
        
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No active groups available</h3>
          <p className="text-gray-500 mb-4">Check back soon for new group buying opportunities!</p>
          <Button 
            onClick={refetch} 
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ PresetGroups - Rendering featured groups:', featuredGroups.length);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Active Groups</h2>
        <p className="text-gray-600">Connect with others in your area for group buying discounts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredGroups.map((group) => {
          console.log('🎨 Rendering featured group:', {
            id: group.id,
            name: group.name,
            location: group.location,
            memberCount: group.member_count
          });
          
          return (
            <Card key={group.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="outline" className="bg-khrate-50 text-khrate-700">
                    {group.discount_percentage}% OFF
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {group.location && group.region 
                    ? `${group.location}, ${group.region}`
                    : group.location || group.region || 'Location not specified'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{group.member_count}/{group.max_participants} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">{group.discount_percentage}% discount</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {group.status}
                  </Badge>
                </div>
                
                <Button 
                  className="w-full bg-khrate-500 hover:bg-khrate-600" 
                  onClick={() => onJoinGroup(group.join_code)}
                >
                  Join Group
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {featuredGroups.length > 0 && (
        <div className="text-center">
          <Button 
            onClick={refetch} 
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Groups
          </Button>
        </div>
      )}
    </div>
  );
};

export default PresetGroups;
