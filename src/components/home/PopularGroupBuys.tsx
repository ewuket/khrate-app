
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Percent, Calendar } from "lucide-react";
import { useFeaturedGroups } from "@/hooks/useFeaturedGroups";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupBuying } from "@/contexts/GroupBuyingContext";

const PopularGroupBuys = () => {
  const { data: featuredGroups = [], isLoading } = useFeaturedGroups();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { joinGroup } = useGroupBuying();

  const handleJoinGroup = async (joinCode: string, groupName: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    try {
      await joinGroup(joinCode);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join active group buying sessions in your area and save more together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredGroups.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No featured group buying sessions are currently available. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Buys</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join active group buying sessions in your area and save more together.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow border-2 hover:border-khrate-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="secondary" className="bg-khrate-100 text-khrate-700">
                    <Percent className="h-3 w-3 mr-1" />
                    {group.discount_percentage}% OFF
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {group.location}, {group.region}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-khrate-500" />
                    <span>{group.member_count}/{group.max_participants} members</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(group.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-khrate-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(group.member_count / group.max_participants) * 100}%` }}
                  ></div>
                </div>
                
                <Button 
                  className="w-full bg-khrate-500 hover:bg-khrate-600"
                  onClick={() => handleJoinGroup(group.join_code, group.name)}
                >
                  Join Group Buy
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" className="border-khrate-500 text-khrate-600 hover:bg-khrate-50">
            View All Group Buys
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularGroupBuys;
