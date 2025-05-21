
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CartItem from "./CartItem";

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
  return (
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
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Delivery (included):</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-khrate-500 hover:bg-khrate-600">
              Proceed to Checkout
            </Button>
            
            <Button variant="outline" className="w-full mt-2">
              Save as Bundle
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default Cart;
