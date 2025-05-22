
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  onClose: () => void;
}

const EmptyCart = ({ onClose }: EmptyCartProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
      <p className="text-muted-foreground text-lg">Your cart is empty</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onClose}
      >
        Continue Shopping
      </Button>
    </div>
  );
};

export default EmptyCart;
