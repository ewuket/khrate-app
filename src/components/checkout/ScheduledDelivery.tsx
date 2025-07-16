
import { useState } from "react";
import DatePicker from "./DatePicker";
import TimeSlotSelector from "./TimeSlotSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarCheck } from "lucide-react";

interface ScheduledDeliveryProps {
  onDeliveryScheduleChange: (schedule: { date: Date | undefined, timeSlot: string }) => void;
}

const ScheduledDelivery = ({ onDeliveryScheduleChange }: ScheduledDeliveryProps) => {
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState("afternoon");

  const handleDateChange = (date: Date | undefined) => {
    setDeliveryDate(date);
    onDeliveryScheduleChange({ date, timeSlot });
  };

  const handleTimeSlotChange = (slot: string) => {
    setTimeSlot(slot);
    onDeliveryScheduleChange({ date: deliveryDate, timeSlot: slot });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-khrate-500" />
          Scheduled Delivery
        </CardTitle>
        <CardDescription>
          Choose when you'd like your order to be delivered
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle>Delivery Information</AlertTitle>
          <AlertDescription>
            Choose your preferred delivery time — even on weekends! We do not deliver on public holidays.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Delivery Date</label>
            <DatePicker date={deliveryDate} onDateChange={handleDateChange} />
          </div>
          
          {deliveryDate && (
            <TimeSlotSelector 
              selectedTimeSlot={timeSlot}
              onTimeSlotChange={handleTimeSlotChange}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledDelivery;
