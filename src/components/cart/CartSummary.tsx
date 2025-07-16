
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  getCartTotal: () => number;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
  onClearCart: () => void;
}

const CartSummary = ({ 
  getCartTotal, 
  formatPrice, 
  onCheckout, 
  onClearCart 
}: CartSummaryProps) => {
  return (
    <div className="sm:justify-between flex-col border-t pt-4">
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
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClearCart}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
