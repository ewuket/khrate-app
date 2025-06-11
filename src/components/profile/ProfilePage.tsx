
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Package, LogOut, Phone, Mail, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log('No user ID, checking localStorage for guest orders');
      const guestOrders = JSON.parse(localStorage.getItem(`khrate_orders_guest`) || '[]');
      setOrders(guestOrders);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);

      // Fetch from Supabase first
      const { data: supabaseOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Supabase orders:', supabaseOrders);

      // Also check localStorage as backup
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Local storage orders:', localOrders);

      // Combine and deduplicate orders
      const allOrders = [...(supabaseOrders || []), ...localOrders];
      const uniqueOrders = allOrders.reduce((acc, current) => {
        const existingOrder = acc.find(order => order.id === current.id);
        if (!existingOrder) {
          acc.push(current);
        }
        return acc;
      }, [] as Order[]);

      console.log('Combined unique orders:', uniqueOrders);

      // Sort by creation date
      uniqueOrders.sort((a, b) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );

      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Fallback to localStorage only
      const localOrders = JSON.parse(localStorage.getItem(`khrate_orders_${user.id}`) || '[]');
      console.log('Fallback to localStorage orders:', localOrders);
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

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

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload to Supabase storage
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result as string;
        await updateProfile({ profile_image_url: imageData });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
              <div className="relative inline-block">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage 
                    src={profile?.profile_image_url} 
                    alt={profile?.full_name || 'Profile'} 
                  />
                  <AvatarFallback className="text-lg bg-khrate-100 text-khrate-600">
                    {profile?.full_name ? getInitials(profile.full_name) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-khrate-500 text-white rounded-full p-1 cursor-pointer hover:bg-khrate-600 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <h3 className="font-semibold text-lg mt-4">
                {profile?.full_name || user?.user_metadata?.full_name || 'User'}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user?.email}</span>
              </div>
              
              {(profile?.phone || user?.user_metadata?.phone_number) && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{profile?.phone || user.user_metadata.phone_number}</span>
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <p className="text-sm text-gray-600">
                          {order.created_at ? formatDate(order.created_at) : 'Recent order'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-khrate-600">
                          {formatPrice(order.total_amount)}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <span>Items: {order.items.map((item: any) => item.name || item.product_name).join(', ')}</span>
                      ) : (
                        <span>Order details</span>
                      )}
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
