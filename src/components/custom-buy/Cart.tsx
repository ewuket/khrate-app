
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CartItem from "./CartItem";
import { useState } from "react";
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
import { toast } from "sonner";

interface CartProps {
  cart: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    unit: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
  }>;
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (productId: number) => void;
  calculateTotal: () => string;
}

const Cart = ({ 
  cart, 
  products, 
  onAddToCart, 
  onRemoveFromCart, 
  calculateTotal 
}: CartProps) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setCheckoutOpen(false);
      toast.success("Payment successful! Your order has been placed.");
    }, 2000);
  };

  return (
    <>
      <Card className="sticky top-24">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {cart.map(item => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    unit={item.unit}
                    onAddToCart={onAddToCart}
                    onRemoveFromCart={onRemoveFromCart}
                    products={products}
                  />
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>{calculateTotal()} RWF</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Delivery (included):</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-orange-500">{calculateTotal()} RWF</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              
              <Button variant="outline" className="w-full mt-2">
                Save as Bundle
              </Button>
            </>
          )}
        </div>
      </Card>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your order by choosing a payment method.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePayment}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <RadioGroup 
                  id="payment-method" 
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
                  <span className="text-orange-500">{calculateTotal()} RWF</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={processingPayment}
                className="bg-orange-500 hover:bg-orange-600"
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

export default Cart;
