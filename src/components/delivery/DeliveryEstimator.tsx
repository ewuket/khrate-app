import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Package } from "lucide-react";

interface DeliveryEstimatorProps {
  deliveryAddress?: string;
  showFreeDelivery?: boolean;
}

const DeliveryEstimator = ({ deliveryAddress, showFreeDelivery = true }: DeliveryEstimatorProps) => {
  // Calculate estimated delivery time (2-4 hours for Kigali)
  const now = new Date();
  const minDeliveryTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const maxDeliveryTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Estimated Delivery</p>
              <p className="text-sm text-muted-foreground">
                Today, {formatTime(minDeliveryTime)} - {formatTime(maxDeliveryTime)}
              </p>
            </div>
          </div>

          {deliveryAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
              </div>
            </div>
          )}

          {showFreeDelivery && (
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-600">Free Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Delivery fee included in price
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryEstimator;
