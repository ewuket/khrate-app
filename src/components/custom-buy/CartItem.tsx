
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (productId: number) => void;
  products: Array<{
    id: number;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
  }>;
}

const CartItem = ({ 
  id, 
  name, 
  price, 
  quantity, 
  unit, 
  onAddToCart, 
  onRemoveFromCart,
  products 
}: CartItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {price.toLocaleString()} RWF x {quantity} {unit}(s)
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => onRemoveFromCart(id)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => {
            const product = products.find(p => p.id === id);
            if (product) {
              onAddToCart(product);
            }
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
