
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StockItem {
  id: number;
  quantity: number;
  type: 'custom_item' | 'bundle_item';
  name: string;
}

export const useStockManagement = () => {
  const reduceStockAfterOrderConfirmation = async (orderId: string) => {
    try {
      console.log('🔄 Processing stock reduction for order:', orderId);

      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('❌ Error fetching order:', orderError);
        throw orderError;
      }

      if (!order || !order.items) {
        console.warn('⚠️ No order items found');
        return;
      }

      console.log('📦 Processing items for stock reduction:', order.items);

      // Process each item in the order
      for (const item of order.items) {
        if (item.type === 'custom_item') {
          // Reduce stock for custom items
          await reduceCustomItemStock(item.product_id, item.quantity);
        } else if (item.type === 'bundle') {
          // For bundles, reduce stock of individual bundle items
          await reduceBundleItemsStock(item.product_id, item.quantity);
        }
      }

      console.log('✅ Stock reduction completed for order:', orderId);
      toast.success('Stock levels updated successfully');
    } catch (error) {
      console.error('❌ Error reducing stock:', error);
      toast.error('Failed to update stock levels');
      throw error;
    }
  };

  const reduceCustomItemStock = async (itemId: number, quantityOrdered: number) => {
    try {
      console.log(`🔄 Reducing stock for custom item ${itemId} by ${quantityOrdered}`);

      // Get current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from('custom_buy_items')
        .select('stock_quantity, name')
        .eq('id', itemId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching current stock:', fetchError);
        throw fetchError;
      }

      if (!currentItem) {
        console.warn(`⚠️ Custom item ${itemId} not found`);
        return;
      }

      const newStock = Math.max(0, currentItem.stock_quantity - quantityOrdered);
      
      console.log(`📊 Stock update for ${currentItem.name}: ${currentItem.stock_quantity} → ${newStock}`);

      // Update stock
      const { error: updateError } = await supabase.rpc('update_custom_item_safe', {
        item_id: itemId,
        item_data: { stock_quantity: newStock }
      });

      if (updateError) {
        console.error('❌ Error updating custom item stock:', updateError);
        throw updateError;
      }

      console.log(`✅ Stock updated for custom item: ${currentItem.name}`);
    } catch (error) {
      console.error(`❌ Failed to reduce stock for custom item ${itemId}:`, error);
      throw error;
    }
  };

  const reduceBundleItemsStock = async (bundleId: number, bundleQuantity: number) => {
    try {
      console.log(`🔄 Reducing stock for bundle ${bundleId} items (quantity: ${bundleQuantity})`);

      // Get bundle items
      const { data: bundleItems, error: bundleError } = await supabase
        .from('bundle_items')
        .select('*')
        .eq('bundle_id', bundleId);

      if (bundleError) {
        console.error('❌ Error fetching bundle items:', bundleError);
        throw bundleError;
      }

      if (!bundleItems || bundleItems.length === 0) {
        console.warn(`⚠️ No items found for bundle ${bundleId}`);
        return;
      }

      console.log(`📦 Processing ${bundleItems.length} items in bundle:`, bundleItems);

      // For each bundle item, find corresponding custom item and reduce stock
      for (const bundleItem of bundleItems) {
        // Find custom item by name (assuming bundle item names match custom item names)
        const { data: customItems, error: searchError } = await supabase
          .from('custom_buy_items')
          .select('id, stock_quantity, name')
          .ilike('name', bundleItem.item_name);

        if (searchError) {
          console.error(`❌ Error searching for custom item ${bundleItem.item_name}:`, searchError);
          continue;
        }

        if (!customItems || customItems.length === 0) {
          console.warn(`⚠️ No matching custom item found for bundle item: ${bundleItem.item_name}`);
          continue;
        }

        // Use the first match (exact name match preferred)
        const customItem = customItems.find(item => item.name.toLowerCase() === bundleItem.item_name.toLowerCase()) || customItems[0];
        
        // Calculate total quantity needed (bundle quantity × item quantity per bundle)
        const totalQuantityNeeded = bundleQuantity * (bundleItem.quantity || 1);
        
        await reduceCustomItemStock(customItem.id, totalQuantityNeeded);
      }

      console.log(`✅ Stock reduction completed for bundle ${bundleId}`);
    } catch (error) {
      console.error(`❌ Failed to reduce stock for bundle ${bundleId}:`, error);
      throw error;
    }
  };

  const checkStockAvailability = async (items: any[]) => {
    try {
      console.log('🔍 Checking stock availability for items:', items);

      const stockIssues = [];

      for (const item of items) {
        if (item.type === 'custom_item') {
          const { data: customItem, error } = await supabase
            .from('custom_buy_items')
            .select('stock_quantity, name')
            .eq('id', item.product_id)
            .single();

          if (error || !customItem) {
            stockIssues.push(`Item "${item.product_name}" not found`);
            continue;
          }

          if (customItem.stock_quantity < item.quantity) {
            stockIssues.push(`Insufficient stock for "${customItem.name}". Available: ${customItem.stock_quantity}, Requested: ${item.quantity}`);
          }
        }
      }

      return {
        available: stockIssues.length === 0,
        issues: stockIssues
      };
    } catch (error) {
      console.error('❌ Error checking stock availability:', error);
      return {
        available: false,
        issues: ['Error checking stock availability']
      };
    }
  };

  return {
    reduceStockAfterOrderConfirmation,
    reduceCustomItemStock,
    reduceBundleItemsStock,
    checkStockAvailability
  };
};
