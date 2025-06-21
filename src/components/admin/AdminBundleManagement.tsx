
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save, X, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Bundle {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

interface BundleItem {
  id: number;
  bundle_id: number;
  item_name: string;
  quantity: number;
  unit: string;
}

const AdminBundleManagement = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundleItems, setBundleItems] = useState<{ [key: number]: BundleItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [editingBundle, setEditingBundle] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newBundle, setNewBundle] = useState({
    title: '',
    description: '',
    price: 0,
    original_price: 0,
    image_url: '',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    try {
      setLoading(true);
      console.log('Loading bundles...');
      
      // Load bundles
      const { data: bundlesData, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .order('id', { ascending: true });

      if (bundlesError) {
        console.error('Error loading bundles:', bundlesError);
        throw bundlesError;
      }

      console.log('Bundles loaded:', bundlesData);
      setBundles(bundlesData || []);

      // Load bundle items for each bundle
      if (bundlesData && bundlesData.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('bundle_items')
          .select('*')
          .in('bundle_id', bundlesData.map(b => b.id));

        if (itemsError) {
          console.error('Error loading bundle items:', itemsError);
          throw itemsError;
        }

        console.log('Bundle items loaded:', itemsData);
        
        // Group items by bundle_id
        const itemsByBundle: { [key: number]: BundleItem[] } = {};
        (itemsData || []).forEach(item => {
          if (!itemsByBundle[item.bundle_id]) {
            itemsByBundle[item.bundle_id] = [];
          }
          itemsByBundle[item.bundle_id].push(item);
        });
        
        setBundleItems(itemsByBundle);
      }

      toast.success('Bundles loaded successfully');
    } catch (error) {
      console.error('Error loading bundles:', error);
      toast.error('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundle = async () => {
    try {
      if (!newBundle.title || !newBundle.price) {
        toast.error('Please fill in required fields');
        return;
      }

      const { data, error } = await supabase
        .from('bundles')
        .insert([{
          ...newBundle,
          original_price: newBundle.original_price || null
        }])
        .select()
        .single();

      if (error) throw error;

      setBundles(prev => [...prev, data]);
      setNewBundle({
        title: '',
        description: '',
        price: 0,
        original_price: 0,
        image_url: '',
        is_active: true,
        is_featured: false
      });
      setShowAddForm(false);
      toast.success('Bundle added successfully');
    } catch (error) {
      console.error('Error adding bundle:', error);
      toast.error('Failed to add bundle');
    }
  };

  const handleDeleteBundle = async (bundleId: number) => {
    try {
      // First delete bundle items
      const { error: itemsError } = await supabase
        .from('bundle_items')
        .delete()
        .eq('bundle_id', bundleId);

      if (itemsError) throw itemsError;

      // Then delete bundle
      const { error: bundleError } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId);

      if (bundleError) throw bundleError;

      setBundles(prev => prev.filter(b => b.id !== bundleId));
      setBundleItems(prev => {
        const updated = { ...prev };
        delete updated[bundleId];
        return updated;
      });
      
      toast.success('Bundle deleted successfully');
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
    }
  };

  const toggleBundleActive = async (bundleId: number, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('bundles')
        .update({ is_active: !isActive })
        .eq('id', bundleId);

      if (error) throw error;

      setBundles(prev =>
        prev.map(bundle =>
          bundle.id === bundleId
            ? { ...bundle, is_active: !isActive }
            : bundle
        )
      );

      toast.success(`Bundle ${!isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating bundle:', error);
      toast.error('Failed to update bundle');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading bundles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bundle Management</h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-khrate-500 hover:bg-khrate-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bundle
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-2 border-khrate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Bundle</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newBundle.title}
                  onChange={(e) => setNewBundle(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Bundle title"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (RWF) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newBundle.price}
                  onChange={(e) => setNewBundle(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="original_price">Original Price (RWF)</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={newBundle.original_price}
                  onChange={(e) => setNewBundle(prev => ({ ...prev, original_price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={newBundle.image_url}
                  onChange={(e) => setNewBundle(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newBundle.description}
                onChange={(e) => setNewBundle(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Bundle description"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAddBundle} className="bg-khrate-500 hover:bg-khrate-600">
                <Save className="h-4 w-4 mr-2" />
                Add Bundle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No bundles found</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-khrate-500 hover:bg-khrate-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Bundle
            </Button>
          </div>
        ) : (
          bundles.map((bundle) => (
            <Card key={bundle.id} className={`${!bundle.is_active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{bundle.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBundleActive(bundle.id, bundle.is_active)}
                      className={bundle.is_active ? 'text-green-600' : 'text-gray-400'}
                    >
                      {bundle.is_active ? 'Active' : 'Inactive'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBundle(bundle.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {bundle.image_url && (
                  <img
                    src={bundle.image_url}
                    alt={bundle.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <p className="text-sm text-gray-600">{bundle.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-khrate-600">
                    {bundle.price.toLocaleString()} RWF
                  </span>
                  {bundle.original_price && bundle.original_price > bundle.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {bundle.original_price.toLocaleString()} RWF
                    </span>
                  )}
                </div>
                {bundleItems[bundle.id] && bundleItems[bundle.id].length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Items:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      {bundleItems[bundle.id].map((item, index) => (
                        <div key={index}>
                          {item.quantity} {item.unit} {item.item_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBundleManagement;
