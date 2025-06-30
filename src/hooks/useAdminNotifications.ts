
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminNotification {
  id: string;
  type: 'order' | 'group_join' | 'group_created' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    setupRealtimeSubscriptions();
  }, []);

  const loadNotifications = async () => {
    try {
      // For now, create mock notifications based on recent activity
      const mockNotifications: AdminNotification[] = [
        {
          id: '1',
          type: 'order',
          title: 'New Order Received',
          message: 'A new order has been placed by a customer',
          read: false,
          created_at: new Date().toISOString(),
          data: { orderId: 'order-123' }
        },
        {
          id: '2',
          type: 'group_join',
          title: 'New Group Member',
          message: 'Someone joined the "Fresh Vegetables" group',
          read: false,
          created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          data: { groupId: 'group-456' }
        },
        {
          id: '3',
          type: 'payment',
          title: 'Payment Completed',
          message: 'Payment has been processed for order #789',
          read: true,
          created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          data: { orderId: 'order-789' }
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Set up real-time subscriptions for orders
    const ordersChannel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order received:', payload);
          const newNotification: AdminNotification = {
            id: `order-${payload.new.id}`,
            type: 'order',
            title: 'New Order Received',
            message: `New order placed for RWF ${payload.new.total_amount}`,
            read: false,
            created_at: new Date().toISOString(),
            data: { orderId: payload.new.id }
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info('New order received!');
        }
      )
      .subscribe();

    // Set up real-time subscriptions for group members
    const groupMembersChannel = supabase
      .channel('admin-group-members')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_members'
        },
        (payload) => {
          console.log('New group member:', payload);
          const newNotification: AdminNotification = {
            id: `group-member-${payload.new.id}`,
            type: 'group_join',
            title: 'New Group Member',
            message: 'Someone joined a group buying session',
            read: false,
            created_at: new Date().toISOString(),
            data: { groupId: payload.new.group_session_id }
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info('New group member joined!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(groupMembersChannel);
    };
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? prev - 1 : prev;
    });
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadNotifications
  };
};
