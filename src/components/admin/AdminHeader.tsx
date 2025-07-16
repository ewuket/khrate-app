
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Bell, RefreshCw } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import AdminSettingsModal from "./AdminSettingsModal";

const AdminHeader = () => {
  const { adminUser, logoutAdmin } = useAdmin();
  const [showSettings, setShowSettings] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Khrate platform</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Welcome, {adminUser?.email}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logoutAdmin}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AdminSettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default AdminHeader;
