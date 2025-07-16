
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
      console.log('🔔 Loading admin notifications...');
      
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Failed to load notifications:', error);
        throw error;
      }

      const formattedNotifications = (data || []).map(notification => ({
        ...notification,
        type: notification.type as AdminNotification['type']
      }));
      
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      console.log('✅ Notifications loaded:', formattedNotifications.length);
    } catch (error: any) {
      console.error('❌ Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    console.log('🔄 Setting up realtime subscriptions for notifications...');
    
    // Set up real-time subscriptions for new notifications
    const notificationsChannel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          console.log('🔔 New notification received:', payload);
          const newNotification = {
            ...payload.new,
            type: payload.new.type as AdminNotification['type']
          } as AdminNotification;
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info(newNotification.title);
        }
      )
      .subscribe();

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
          console.log('📋 New order received:', payload);
          // Notification will be created automatically by the trigger
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
          console.log('👥 New group member:', payload);
          // Create notification manually since we don't have a trigger for this
          supabase.rpc('create_admin_notification', {
            p_title: 'New Group Member',
            p_message: 'Someone joined a group buying session',
            p_type: 'group_join'
          }).then(({ error }) => {
            if (error) console.error('❌ Error creating notification:', error);
          });
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up notification subscriptions');
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(groupMembersChannel);
    };
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('❌ Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('❌ Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? prev - 1 : prev;
      });
      toast.success('Notification deleted');
    } catch (error: any) {
      console.error('❌ Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
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
