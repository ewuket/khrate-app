
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, DollarSign, CheckCircle, Clock, AlertTriangle, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminOrder } from "@/types/admin";

interface AdminOrdersListProps {
  orders: AdminOrder[];
  onUpdateOrderStatus: (orderId: string, currentStatus: string) => void;
  onUpdatePaymentStatus: (orderId: string, currentStatus: string) => void;
}

const AdminOrdersList = ({ orders, onUpdateOrderStatus, onUpdatePaymentStatus }: AdminOrdersListProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'cancelled':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handlePhoneCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const getPhoneNumber = (order: AdminOrder) => {
    // Priority: user_profile.phone > order.phone_number
    return order.user_profile?.phone || order.phone_number || null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders with contact information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 10).map((order) => {
            const phoneNumber = getPhoneNumber(order);
            
            return (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {order.user_profile?.full_name || order.user_profile?.email || 'Guest'}
                    </p>
                    {phoneNumber && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePhoneCall(phoneNumber)}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        title={`Call ${phoneNumber}`}
                      >
                        <Phone className="h-3 w-3 text-green-600" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(order.total_amount)} • {new Date(order.created_at || '').toLocaleDateString()}
                  </p>
                  {phoneNumber && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {phoneNumber}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUpdateOrderStatus(order.id, order.status)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onUpdatePaymentStatus(order.id, order.payment_status)}
                    >
                      <DollarSign className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No orders found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminOrdersList;
