
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { useCart } from "@/contexts/CartContext";
import { Check, ChevronRight, CreditCard, Loader2, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PaymentInstructionsModal from "./PaymentInstructionsModal";

interface CustomBuyCheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomBuyCheckoutDialog: React.FC<CustomBuyCheckoutDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [activeTab, setActiveTab] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Delivery details
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    instructions: ""
  });
  
  const handleContinueToPayment = () => {
    if (!isAuthenticated) {
      onClose();
      openAuthModal();
      return;
    }
    
    // Validate delivery details
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
      toast.error("Please fill in all required delivery details");
      return;
    }
    
    setActiveTab("payment");
  };
  
  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    
    if ((paymentMethod === "mtn" || paymentMethod === "airtel") && !phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentComplete(true);
      
      // Clear cart after successful payment
      clearCart();
      
      // Show success message
      toast.success("Payment successful! Your order has been placed.");
      
      // After 2 seconds, close dialog and trigger success callback
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    }, 3000);
  };
  
  const handleShowInstructions = () => {
    setShowInstructions(true);
  };
  
  const cartTotal = getCartTotal();
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="delivery" disabled={isPaymentComplete}>
                  Delivery Details
                </TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  disabled={isPaymentComplete}
                >
                  Payment
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="max-h-[60vh] px-6 py-4">
              <TabsContent value="delivery" className="space-y-4 mt-0">
                {/* Delivery form would go here */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Please enter your delivery details below.
                  </p>
                  
                  {/* This is a placeholder for the delivery form */}
                  <div className="space-y-4 py-2">
                    <p className="text-sm">
                      For demo purposes, delivery details are pre-filled.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-khrate-500 hover:bg-khrate-600"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-6 mt-0">
                {!isPaymentComplete ? (
                  <>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Order Summary</h3>
                          <div className="text-sm space-y-1">
                            {cart.map((item) => (
                              <div key={item.id} className="flex justify-between">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            <Separator className="my-2" />
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>{formatCurrency(cartTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <PaymentMethodSelector
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                      phoneNumber={phoneNumber}
                      onPhoneNumberChange={setPhoneNumber}
                      onShowPaymentInstructions={handleShowInstructions}
                    />
                    
                    <div className="pt-4 space-y-4">
                      <Button 
                        className="w-full bg-khrate-500 hover:bg-khrate-600"
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Pay {formatCurrency(cartTotal)}
                            {paymentMethod === "mtn" && <Phone className="ml-2 h-4 w-4" />}
                            {paymentMethod === "airtel" && <Phone className="ml-2 h-4 w-4" />}
                            {paymentMethod === "card" && <CreditCard className="ml-2 h-4 w-4" />}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("delivery")}
                        disabled={isProcessing}
                      >
                        Back to Delivery Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium">Payment Successful!</h3>
                    <p className="text-center text-muted-foreground">
                      Your order has been placed and will be delivered soon.
                    </p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <PaymentInstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        paymentMethod={paymentMethod}
      />
    </>
  );
};

export default CustomBuyCheckoutDialog;
