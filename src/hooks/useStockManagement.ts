
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStockManagement = () => {
  
  const updateStockAfterOrder = async (orderItems: any[]) => {
    console.log('🔄 Updating stock after order:', orderItems);
    
    try {
      for (const item of orderItems) {
        if (item.type === 'bundle') {
          // Get bundle items and reduce stock for each
          const { data: bundleData, error: bundleError } = await supabase
            .from('bundles')
            .select(`
              id,
              bundle_items (
                item_name,
                quantity,
                unit
              )
            `)
            .eq('id', item.id)
            .single();

          if (bundleError) {
            console.error('❌ Error fetching bundle items:', bundleError);
            continue;
          }

          if (bundleData?.bundle_items) {
            for (const bundleItem of bundleData.bundle_items) {
              await reduceCustomItemStock(bundleItem.item_name, bundleItem.quantity * item.quantity);
            }
          }
        } else if (item.type === 'custom') {
          // Directly reduce stock for custom items
          await reduceCustomItemStock(item.name, item.quantity);
        } else if (item.type === 'group') {
          // Handle group items - these should have their own item list
          if (item.items && Array.isArray(item.items)) {
            for (const groupItem of item.items) {
              await reduceCustomItemStock(groupItem.name, groupItem.quantity);
            }
          }
        }
      }
      
      console.log('✅ Stock updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating stock:', error);
      toast.error('Failed to update stock levels');
      return false;
    }
  };

  const reduceCustomItemStock = async (itemName: string, quantity: number) => {
    console.log(`🔄 Reducing stock for ${itemName} by ${quantity}`);
    
    try {
      // Find the custom item by name
      const { data: items, error: findError } = await supabase
        .from('custom_buy_items')
        .select('id, stock_quantity, name')
        .ilike('name', itemName)
        .limit(1);

      if (findError || !items || items.length === 0) {
        console.warn(`⚠️ Item not found in custom_buy_items: ${itemName}`);
        return;
      }

      const item = items[0];
      const newStock = Math.max(0, (item.stock_quantity || 0) - quantity);

      const { error: updateError } = await supabase
        .from('custom_buy_items')
        .update({ 
          stock_quantity: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (updateError) {
        console.error(`❌ Error updating stock for ${itemName}:`, updateError);
      } else {
        console.log(`✅ Stock updated for ${itemName}: ${item.stock_quantity} -> ${newStock}`);
      }
    } catch (error) {
      console.error(`❌ Error reducing stock for ${itemName}:`, error);
    }
  };

  const getLowStockItems = async (threshold: number = 10) => {
    try {
      const { data, error } = await supabase.rpc('get_low_stock_items', { threshold });
      
      if (error) {
        console.error('❌ Error fetching low stock items:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error in getLowStockItems:', error);
      return [];
    }
  };

  return {
    updateStockAfterOrder,
    getLowStockItems
  };
};
