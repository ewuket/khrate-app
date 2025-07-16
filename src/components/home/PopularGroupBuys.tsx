
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Tag } from "lucide-react";
import { useFeaturedGroups } from "@/hooks/useFeaturedGroups";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PopularGroupBuys = () => {
  const { data: featuredGroups = [], isLoading } = useFeaturedGroups();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate('/group-buy');
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Group Buys</h2>
            <p className="text-gray-600">Join others and save money on bulk purchases</p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading group buys...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Group Buys</h2>
          <p className="text-gray-600">Join others and save money on bulk purchases</p>
        </div>
        
        {featuredGroups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredGroups.slice(0, 3).map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary" className="bg-khrate-100 text-khrate-700">
                      Popular
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
                    onClick={handleJoinClick}
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No active group buying sessions at the moment.</p>
            <Button 
              onClick={handleJoinClick}
              className="mt-4 bg-khrate-500 hover:bg-khrate-600"
            >
              Create Your Group
            </Button>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button 
            onClick={handleJoinClick}
            variant="outline" 
            className="border-khrate-500 text-khrate-600 hover:bg-khrate-50"
          >
            View All Group Buys
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularGroupBuys;
