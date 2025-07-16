
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminBundle } from '@/types/admin';

export const useAdminBundleOperations = () => {
  const [loading, setLoading] = useState(false);

  const createBundle = async (bundleData: {
    title: string;
    description: string;
    price: number;
    original_price?: number;
    image_url?: string;
    is_featured?: boolean;
    is_active?: boolean;
    items: Array<{
      item_name: string;
      quantity: number;
      unit: string;
    }>;
  }): Promise<AdminBundle | null> => {
    try {
      setLoading(true);
      console.log('🔄 Creating bundle:', bundleData.title);

      // Create the bundle first
      const { data: bundle, error: bundleError } = await supabase
        .from('bundles')
        .insert({
          title: bundleData.title,
          description: bundleData.description,
          price: bundleData.price,
          original_price: bundleData.original_price || bundleData.price,
          image_url: bundleData.image_url || '/placeholder.svg',
          is_featured: bundleData.is_featured || false,
          is_active: bundleData.is_active !== false
        })
        .select()
        .single();

      if (bundleError) {
        console.error('❌ Bundle creation error:', bundleError);
        throw bundleError;
      }

      if (!bundle) {
        throw new Error('Bundle creation failed - no data returned');
      }

      console.log('✅ Bundle created successfully:', bundle.id);

      // Create bundle items
      if (bundleData.items && bundleData.items.length > 0) {
        const bundleItems = bundleData.items.map(item => ({
          bundle_id: bundle.id,
          item_name: item.item_name,
          quantity: item.quantity,
          unit: item.unit || 'pieces'
        }));

        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(bundleItems);

        if (itemsError) {
          console.error('❌ Bundle items creation error:', itemsError);
          // Delete the bundle if items creation fails
          await supabase.from('bundles').delete().eq('id', bundle.id);
          throw itemsError;
        }

        console.log('✅ Bundle items created successfully');
      }

      // Fetch the complete bundle with items
      const { data: completeBundle, error: fetchError } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_items(item_name, quantity, unit)
        `)
        .eq('id', bundle.id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching complete bundle:', fetchError);
        throw fetchError;
      }

      const formattedBundle: AdminBundle = {
        ...completeBundle,
        items: completeBundle.bundle_items || [],
        items_count: completeBundle.bundle_items?.length || 0,
        bundle_items: completeBundle.bundle_items || []
      };

      toast.success('Bundle created successfully!');
      return formattedBundle;

    } catch (error: any) {
      console.error('❌ Bundle creation failed:', error);
      toast.error(error.message || 'Failed to create bundle');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBundle = async (bundleId: number, bundleData: Partial<AdminBundle>): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Updating bundle:', bundleId);

      const { error } = await supabase
        .from('bundles')
        .update({
          title: bundleData.title,
          description: bundleData.description,
          price: bundleData.price,
          original_price: bundleData.original_price,
          image_url: bundleData.image_url,
          is_featured: bundleData.is_featured,
          is_active: bundleData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId);

      if (error) {
        console.error('❌ Bundle update error:', error);
        throw error;
      }

      console.log('✅ Bundle updated successfully');
      toast.success('Bundle updated successfully!');
      return true;

    } catch (error: any) {
      console.error('❌ Bundle update failed:', error);
      toast.error(error.message || 'Failed to update bundle');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteBundle = async (bundleId: number): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 Deleting bundle:', bundleId);

      // Delete bundle items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (itemsError) {
        console.error('❌ Bundle items deletion error:', itemsError);
        throw itemsError;
      }

      // Delete the bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId);

      if (bundleError) {
        console.error('❌ Bundle deletion error:', bundleError);
        throw bundleError;
      }

      console.log('✅ Bundle deleted successfully');
      toast.success('Bundle deleted successfully!');
      return true;

    } catch (error: any) {
      console.error('❌ Bundle deletion failed:', error);
      toast.error(error.message || 'Failed to delete bundle');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleBundleStatus = async (bundleId: number, isActive: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Toggling bundle status:', bundleId, isActive);

      const { error } = await supabase
        .from('bundles')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId);

      if (error) {
        console.error('❌ Bundle status toggle error:', error);
        throw error;
      }

      console.log('✅ Bundle status updated successfully');
      toast.success(`Bundle ${isActive ? 'activated' : 'deactivated'} successfully!`);
      return true;

    } catch (error: any) {
      console.error('❌ Bundle status toggle failed:', error);
      toast.error(error.message || 'Failed to update bundle status');
      return false;
    }
  };

  return {
    createBundle,
    updateBundle,
    deleteBundle,
    toggleBundleStatus,
    loading
  };
};
