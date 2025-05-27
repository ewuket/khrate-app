
import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Public holidays (example list - can be expanded)
const publicHolidays = [
  new Date(2025, 0, 1),  // New Year's Day
  new Date(2025, 1, 14), // Valentine's Day
  new Date(2025, 4, 1),  // Labor Day
  new Date(2025, 6, 1),  // Independence Day
  new Date(2025, 11, 25) // Christmas Day
];

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Function to check if a date is a public holiday
  const isPublicHoliday = (date: Date) => {
    return publicHolidays.some(holiday => 
      holiday.getDate() === date.getDate() && 
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
    );
  };

  // Function to disable dates
  const disableDate = (date: Date) => {
    // Disable dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable public holidays
    return date < today || isPublicHoliday(date);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false); // Auto-collapse calendar after selection
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a delivery date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={disableDate}
          initialFocus
          className="p-3 pointer-events-auto"
        />
        <div className="p-3 border-t text-xs text-muted-foreground">
          <p>We deliver 7 days a week, including weekends!</p>
          <p>Public holidays are not available for delivery.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
