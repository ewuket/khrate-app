
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

interface OrderSummaryProps {
  total: number;
  formatPrice: (price: number) => string;
  deliverySchedule: {
    date: string;
    timeSlot: string;
  };
}

const OrderSummary = ({ total, formatPrice, deliverySchedule }: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-khrate-500" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Amount:</span>
          <span className="text-khrate-600">{formatPrice(total)}</span>
        </div>
        
        {deliverySchedule.date && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Delivery Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Date: {new Date(deliverySchedule.date).toLocaleDateString()}</p>
              {deliverySchedule.timeSlot && (
                <p>Time: {deliverySchedule.timeSlot}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-green-50 border border-green-200 p-3 rounded-md">
          <p className="text-sm text-green-700">
            <strong>Free delivery</strong> for orders within Kigali
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
