
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBasket } from "lucide-react";

const OrdersEmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-medium mb-2">No orders found</h3>
      <p className="text-muted-foreground mb-6">You don't have any orders with this status yet.</p>
      <Button className="bg-khrate-500 hover:bg-khrate-600" asChild>
        <Link to="/bundles">
          <ShoppingBasket className="mr-2 h-4 w-4" />
          Shop Now
        </Link>
      </Button>
    </div>
  );
};

export default OrdersEmptyState;
