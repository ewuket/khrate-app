
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from 'sonner';

export const useProfileOperations = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (user: any, updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const applyFirstTimeUserDiscount = async (userId: string) => {
    try {
      // Check if user already has a discount
      const { data: existingDiscount } = await supabase
        .from('user_discounts')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingDiscount) {
        console.log('User already has a discount');
        return;
      }

      // Create first-time user discount
      const { error } = await supabase
        .from('user_discounts')
        .insert({
          user_id: userId,
          discount_type: 'first_time_user',
          discount_percentage: 10,
          orders_remaining: 3,
          is_active: true
        });

      if (error) throw error;
      console.log('First-time user discount applied');
    } catch (error) {
      console.error('Error applying first-time discount:', error);
    }
  };

  return {
    profile,
    setProfile,
    loading,
    fetchUserProfile,
    updateProfile,
    applyFirstTimeUserDiscount
  };
};
