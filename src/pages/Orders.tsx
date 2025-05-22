
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ArrowRight, ShoppingBasket, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Sample orders data
const orders = [
  {
    id: "ORD-001",
    date: "2025-05-15",
    status: "delivered",
    items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil"],
    total: 35000,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  },
  {
    id: "ORD-002",
    date: "2025-05-10",
    status: "delivered",
    items: ["Eggs", "Milk", "Bread", "Sugar", "Tea"],
    total: 22500,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  },
  {
    id: "ORD-003",
    date: "2025-05-18",
    status: "processing",
    items: ["Rice", "Beans", "Salt", "Oil", "Onions", "Tomatoes"],
    total: 42750,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  },
  {
    id: "ORD-004",
    date: "2025-05-20",
    status: "pending",
    items: ["Flour", "Sugar", "Eggs", "Milk", "Baking Powder"],
    total: 28990,
    deliveryAddress: "123 University Hostel, KN 5 Ave, Kigali, Rwanda"
  }
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800"
};

const Orders = () => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleViewDetails = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleOrderAgain = (order: typeof orders[0]) => {
    toast.success("Items added to your cart");
    // In a real app, we would add the items to the cart here
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
            <p className="mt-2 max-w-lg">
              Track and manage your orders
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            <div className="mb-8">
              <Tabs 
                defaultValue="all" 
                onValueChange={setFilter}
                value={filter}
              >
                <TabsList>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {filteredOrders.length === 0 ? (
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
            ) : (
              <div className="space-y-6">
                {filteredOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold text-lg">{order.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            Ordered on {new Date(order.date).toLocaleDateString()}
                          </p>
                          
                          <div className="text-sm text-muted-foreground mb-3">
                            <span className="font-medium">Items:</span> {order.items.join(", ")}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Delivery Address:</span> {order.deliveryAddress}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-xl font-bold mb-4">{order.total.toLocaleString()} RWF</div>
                          
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full md:w-auto"
                              onClick={() => handleViewDetails(order)}
                            >
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full md:w-auto"
                              onClick={() => handleOrderAgain(order)}
                            >
                              Order Again
                              <ShoppingBasket className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Order Details
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDetailsOpen(false)}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{selectedOrder.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  Ordered on {new Date(selectedOrder.date).toLocaleDateString()}
                </p>
              </div>
              
              <div className="border-t border-b py-3">
                <h4 className="font-medium mb-2">Items</h4>
                <ul className="space-y-1">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-sm"><span className="font-medium">Delivery Address:</span> {selectedOrder.deliveryAddress}</p>
              </div>
              
              <div className="flex justify-between items-center font-bold">
                <span>Total Amount:</span>
                <span>{selectedOrder.total.toLocaleString()} RWF</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              className="bg-khrate-500 hover:bg-khrate-600 w-full"
              onClick={() => {
                if (selectedOrder) handleOrderAgain(selectedOrder);
                setDetailsOpen(false);
              }}
            >
              Order Again
              <ShoppingBasket className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Orders;
