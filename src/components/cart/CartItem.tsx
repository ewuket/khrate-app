
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    product_unit?: string;
  };
  formatPrice: (price: number) => string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ 
  item, 
  formatPrice, 
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) => {
  return (
    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{item.product_name}</h3>
        <div className="text-sm text-muted-foreground">
          {formatPrice(item.product_price)} per {item.product_unit || 'item'}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="font-medium whitespace-nowrap">
        {formatPrice(item.product_price * item.quantity)}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};

export default CartItem;
