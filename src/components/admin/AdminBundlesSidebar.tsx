
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Eye, EyeOff, Star, StarOff, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AdminBundle } from "@/types/admin";
import { useAdminOperations } from "@/hooks/useAdminOperations";

interface AdminBundlesSidebarProps {
  bundles: AdminBundle[];
  loading: boolean;
  onCreateBundle: () => void;
  onEditBundle: (bundle: AdminBundle) => void;
  onDeleteBundle: (bundleId: number) => void;
}

const AdminBundlesSidebar = ({ 
  bundles, 
  loading, 
  onCreateBundle, 
  onEditBundle, 
  onDeleteBundle 
}: AdminBundlesSidebarProps) => {
  const { toggleBundleActive, toggleBundleFeatured, isToggling } = useAdminOperations();

  const handleToggleActive = async (bundle: AdminBundle) => {
    await toggleBundleActive(bundle.id, bundle.is_active || false);
  };

  const handleToggleFeatured = async (bundle: AdminBundle) => {
    await toggleBundleFeatured(bundle.id, bundle.is_featured || false);
  };

  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Bundle Management</CardTitle>
          <CardDescription>Loading bundles...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bundle Management</CardTitle>
            <CardDescription>Manage your product bundles</CardDescription>
          </div>
          <Button size="sm" onClick={onCreateBundle}>
            <Plus className="h-4 w-4 mr-1" />
            Add Bundle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {bundles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No bundles found</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onCreateBundle}
                className="mt-2"
              >
                Create your first bundle
              </Button>
            </div>
          ) : (
            bundles.slice(0, 10).map((bundle) => (
              <div
                key={bundle.id}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{bundle.title}</h4>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(bundle.price)}
                      {bundle.original_price && (
                        <span className="line-through ml-1 text-gray-400">
                          {formatCurrency(bundle.original_price)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Badge
                      variant={bundle.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {bundle.is_active ? "Active" : "Inactive"}
                    </Badge>
                    {bundle.is_featured && (
                      <Badge variant="outline" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(bundle)}
                    disabled={isToggling === `bundle-${bundle.id}`}
                    className="h-6 w-6 p-0"
                    title={bundle.is_active ? "Deactivate" : "Activate"}
                  >
                    {bundle.is_active ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleFeatured(bundle)}
                    disabled={isToggling === `bundle-featured-${bundle.id}`}
                    className="h-6 w-6 p-0"
                    title={bundle.is_featured ? "Unfeature" : "Feature"}
                  >
                    {bundle.is_featured ? (
                      <StarOff className="h-3 w-3" />
                    ) : (
                      <Star className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditBundle(bundle)}
                    className="h-6 w-6 p-0"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteBundle(bundle.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBundlesSidebar;
