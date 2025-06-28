
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Percent } from "lucide-react";
import { useFeaturedGroups } from "@/hooks/useFeaturedGroups";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const PopularGroupBuys = () => {
  const { featuredGroups, loading, error } = useFeaturedGroups();
  const navigate = useNavigate();

  console.log('🏠 PopularGroupBuys component render state:', {
    featuredGroupsCount: featuredGroups?.length,
    loading,
    error
  });

  if (error) {
    console.error('❌ PopularGroupBuys - Error state:', error);
    return null; // Don't show section if there's an error
  }

  if (loading) {
    console.log('⏳ PopularGroupBuys - Loading state');
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join active group buying sessions and save money with others in your community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
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
      </section>
    );
  }

  if (!featuredGroups || featuredGroups.length === 0) {
    console.log('📭 PopularGroupBuys - No featured groups found');
    return null; // Don't show section if no groups
  }

  console.log('✅ PopularGroupBuys - Rendering featured groups:', featuredGroups.length);

  // Show only first 3 groups for homepage
  const displayGroups = featuredGroups.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join active group buying sessions and save money with others in your community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayGroups.map((group) => {
            console.log('🎨 Rendering popular group:', {
              id: group.id,
              name: group.name,
              location: group.location
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
                  
                  <Button 
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                    onClick={() => navigate('/group-buy')}
                  >
                    Join Group Buy
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/group-buy')}
          >
            View All Group Buys
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularGroupBuys;
