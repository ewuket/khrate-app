import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { CartItem } from "@/types/cart";

interface CustomBuyCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  saveOrder: () => void;
  clearCart: () => void;
}

const CustomBuyCheckoutDialog = ({
  open,
  onOpenChange,
  cartItems,
  saveOrder,
  clearCart,
}: CustomBuyCheckoutDialogProps) => {
  const {
    paymentMethod,
    setPaymentMethod,
    phoneNumber,
    setPhoneNumber,
    processingPayment,
    deliverySchedule,
    setDeliverySchedule,
    handlePayment,
    getTimeSlotText,
  } = useCheckoutForm({ onOpenChange, saveOrder, clearCart });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order by choosing a delivery date and payment method.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliverySchedule.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliverySchedule.date ? (
                    format(deliverySchedule.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliverySchedule.date}
                  onSelect={(date) => setDeliverySchedule({ ...deliverySchedule, date: date })}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-base font-semibold">Delivery Time</Label>
            <RadioGroup
              defaultValue="afternoon"
              className="grid grid-cols-1 gap-2"
              onValueChange={(timeSlot) => setDeliverySchedule({ ...deliverySchedule, timeSlot: timeSlot })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="delivery-morning" />
                <Label htmlFor="delivery-morning">
                  Morning (8AM–11AM)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="midday" id="delivery-midday" />
                <Label htmlFor="delivery-midday">
                  Midday (11AM–2PM)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="afternoon" id="delivery-afternoon" />
                <Label htmlFor="delivery-afternoon">
                  Afternoon (2PM–5PM)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="delivery-evening" />
                <Label htmlFor="delivery-evening">
                  Evening (5PM–8PM)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold">Payment Method</Label>
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={setPhoneNumber}
              onShowPaymentInstructions={() => {
                toast({
                  title: "Payment Instructions",
                  description: "Please send your payment to MTN/Airtel Money number: 0795754391",
                });
              }}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={processingPayment} className="bg-khrate-500 hover:bg-khrate-600">
              {processingPayment ? "Processing Payment..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBuyCheckoutDialog;
