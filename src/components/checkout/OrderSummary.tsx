
import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";

interface OrderSummaryProps {
  total: number;
  formatPrice: (price: number) => string;
  deliverySchedule: {
    date: Date | undefined;
    timeSlot: string;
  };
}

const OrderSummary = ({ 
  total, 
  formatPrice, 
  deliverySchedule 
}: OrderSummaryProps) => {
  const getTimeSlotText = (slot: string) => {
    switch(slot) {
      case "morning": return "8AM–11AM";
      case "midday": return "11AM–2PM";
      case "afternoon": return "2PM–5PM";
      case "evening": return "5PM–8PM";
      default: return "2PM–5PM";
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between font-semibold">
        <span>Total Amount:</span>
        <span>{formatPrice(total)}</span>
      </div>
      
      {/* Delivery Schedule Summary */}
      {deliverySchedule.date && (
        <div className="bg-blue-50 p-3 rounded-md mt-2">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-khrate-500" />
            <span className="text-sm font-medium">Delivery scheduled for:</span>
          </div>
          <p className="text-sm mt-1 pl-6">
            {format(deliverySchedule.date, "PPP")} between {getTimeSlotText(deliverySchedule.timeSlot)}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
