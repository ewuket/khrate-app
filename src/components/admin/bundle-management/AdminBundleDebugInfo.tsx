
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

interface AdminBundleDebugInfoProps {
  bundles: any[];
  isLoading: boolean;
  error: any;
  onRefresh: () => void;
}

const AdminBundleDebugInfo: React.FC<AdminBundleDebugInfoProps> = ({
  bundles,
  isLoading,
  error,
  onRefresh
}) => {
  if (!error && bundles.length > 0) {
    return null; // Don't show debug info when everything is working
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          Bundle Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Bundle Count:</strong> {bundles.length}
          </div>
          <div>
            <strong>Loading State:</strong> {isLoading ? 'Loading...' : 'Loaded'}
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <strong className="text-red-800">Error:</strong>
            <p className="text-red-700 mt-1">{error.message || 'Unknown error occurred'}</p>
          </div>
        )}

        {bundles.length === 0 && !isLoading && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <strong className="text-yellow-800">No Bundles Found</strong>
            <p className="text-yellow-700 mt-1">
              This could be due to RLS policies or missing admin permissions. 
              Check that your user is properly configured as an admin.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Fetch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBundleDebugInfo;
