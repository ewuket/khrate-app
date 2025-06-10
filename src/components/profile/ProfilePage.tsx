
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Package, LogOut, Phone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Mock order history data
  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2024-12-15',
      total: 32700,
      status: 'Delivered',
      items: ['Single Bundle']
    },
    {
      id: 'ORD-002',
      date: '2024-12-10',
      total: 69240,
      status: 'Delivered',
      items: ['Medium Bundle']
    }
  ];

  const formatPrice = (price: number) => {
    return `RWF ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-khrate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-khrate-600" />
              </div>
              <h3 className="font-semibold text-lg">{user?.user_metadata?.full_name || 'User'}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user?.email}</span>
              </div>
              
              {user?.user_metadata?.phone_number && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{user.user_metadata.phone_number}</span>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-khrate-600">
                          {formatPrice(order.total)}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Items: {order.items.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
