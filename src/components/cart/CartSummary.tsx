
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  total: number;
  formatPrice: (price: number) => string;
}

const CartSummary = ({ 
  total, 
  formatPrice
}: CartSummaryProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery</span>
        <span className="text-green-600">Free</span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-2">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
