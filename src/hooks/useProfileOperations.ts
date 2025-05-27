
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from 'sonner';

export const useProfileOperations = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        await createUserProfile(userId);
      } else if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const newProfile = {
        id: userId,
        email: userData.user?.email || '',
        full_name: userData.user?.user_metadata?.full_name || '',
        discount_orders_remaining: 3,
        total_orders: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const applyFirstTimeUserDiscount = async (userId: string) => {
    try {
      await supabase
        .from('user_discounts')
        .insert([{
          user_id: userId,
          discount_type: 'first_time_user',
          discount_percentage: 10,
          orders_remaining: 3
        }]);
    } catch (error) {
      console.error('Error applying first-time discount:', error);
    }
  };

  const updateProfile = async (user: User | null, updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    }
  };

  return {
    profile,
    setProfile,
    fetchUserProfile,
    createUserProfile,
    applyFirstTimeUserDiscount,
    updateProfile
  };
};
