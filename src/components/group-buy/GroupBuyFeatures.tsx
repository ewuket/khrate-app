
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Plus } from "lucide-react";

const GroupBuyFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-khrate-500" />
            Group Discounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Get 5-15% off when your group reaches the minimum size. The more members, the bigger the savings!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-khrate-500" />
            Fast Delivery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Share delivery costs and get your groceries delivered faster with consolidated orders.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-khrate-500" />
            Easy Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Simple join codes make it easy to invite friends and family to your group buying session.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupBuyFeatures;
