import { ShoppingCart, X, Trash2, Plus, Minus, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import ScheduledDelivery from "../checkout/ScheduledDelivery";
import { format } from "date-fns";

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [deliverySchedule, setDeliverySchedule] = useState<{
    date: Date | undefined;
    timeSlot: string;
  }>({ date: undefined, timeSlot: "afternoon" });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
    closeCart();
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate delivery date
    if (!deliverySchedule.date) {
      toast.error("Please select a delivery date");
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setCheckoutOpen(false);
      clearCart();
      
      // Send confirmation with delivery details
      const deliveryTimeText = getTimeSlotText(deliverySchedule.timeSlot);
      const deliveryDateText = deliverySchedule.date ? format(deliverySchedule.date, "PPP") : "";
      
      toast.success("Payment successful! Your order has been placed.", {
        description: `Scheduled for delivery on ${deliveryDateText} between ${deliveryTimeText}.`,
        duration: 5000,
      });
      
      // Simulate sending email/SMS notification
      console.log("Delivery notification scheduled for:", {
        date: deliveryDateText,
        timeSlot: deliveryTimeText,
        notifyAt: [
          "24 hours before delivery",
          "Morning of delivery day"
        ]
      });
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + " RWF";
  };
  
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
    <>
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="flex flex-row justify-between items-center">
            <SheetTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetHeader>
          
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="py-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                    {item.image && (
                      <div className="h-16 w-16 rounded overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="font-medium whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <SheetFooter className="sm:justify-between flex-col border-t pt-4">
                <div className="w-full space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
                
                <div className="w-full flex flex-col gap-2 mt-4">
                  <Button 
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Schedule your delivery and choose a payment method.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePayment}>
            <div className="grid gap-6 py-4">
              {/* Scheduled Delivery Section */}
              <ScheduledDelivery 
                onDeliveryScheduleChange={setDeliverySchedule} 
              />
              
              <Separator />
              
              {/* Payment Method Section */}
              <div className="space-y-4">
                <h3 className="font-semibold">Payment Method</h3>
                <RadioGroup 
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="mtn" id="mtn" />
                    <Label htmlFor="mtn" className="flex items-center">
                      <span className="font-medium">MTN MoMo</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="equity" id="equity" />
                    <Label htmlFor="equity" className="flex items-center">
                      <span className="font-medium">Equity Bank</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="bk" id="bk" />
                    <Label htmlFor="bk" className="flex items-center">
                      <span className="font-medium">Bank of Kigali</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="im" id="im" />
                    <Label htmlFor="im" className="flex items-center">
                      <span className="font-medium">I&M Bank</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === "mtn" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Your MTN number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>{formatPrice(getCartTotal())}</span>
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
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={processingPayment || !deliverySchedule.date}
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                {processingPayment ? "Processing..." : "Pay Now"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartSidebar;
