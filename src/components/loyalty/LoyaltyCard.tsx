import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LoyaltyCard = () => {
  const { profile } = useAuth();
  const loyaltyPoints = profile?.total_orders ? profile.total_orders * 10 : 0;
  const discountEarned = Math.floor(loyaltyPoints / 100) * 5;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Loyalty Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-2xl font-bold text-primary">{loyaltyPoints}</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            {discountEarned}% Discount
          </Badge>
        </div>
        
        <div className="bg-background/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground mb-2">How it works:</p>
          <ul className="text-sm space-y-1">
            <li>• Earn 10 points per order</li>
            <li>• 100 points = 5% discount on next order</li>
            <li>• Points never expire</li>
          </ul>
        </div>

        {profile?.total_orders && profile.total_orders > 0 && (
          <div className="text-center pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {100 - (loyaltyPoints % 100)} points until next reward!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyCard;
