
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimeSlotSelectorProps {
  selectedTimeSlot: string;
  onTimeSlotChange: (timeSlot: string) => void;
}

const timeSlots = [
  { id: "morning", label: "8AM–11AM", description: "Early morning delivery" },
  { id: "midday", label: "11AM–2PM", description: "Lunch time delivery" },
  { id: "afternoon", label: "2PM–5PM", description: "Afternoon delivery" },
  { id: "evening", label: "5PM–8PM", description: "Evening delivery" },
];

const TimeSlotSelector = ({ selectedTimeSlot, onTimeSlotChange }: TimeSlotSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-khrate-500" />
        <h3 className="text-sm font-medium">Select Delivery Time Slot</h3>
      </div>
      
      <RadioGroup 
        value={selectedTimeSlot} 
        onValueChange={onTimeSlotChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        {timeSlots.map((slot) => (
          <div key={slot.id} className="flex items-center">
            <RadioGroupItem value={slot.id} id={`timeslot-${slot.id}`} className="peer sr-only" />
            <Label
              htmlFor={`timeslot-${slot.id}`}
              className="flex flex-col items-start p-3 border rounded-md cursor-pointer peer-data-[state=checked]:border-khrate-500 peer-data-[state=checked]:bg-khrate-50 hover:bg-gray-50 w-full text-sm"
            >
              <span className="font-medium">{slot.label}</span>
              <span className="text-xs text-muted-foreground">{slot.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default TimeSlotSelector;
