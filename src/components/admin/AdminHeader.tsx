
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import AdminNotifications from "./AdminNotifications";

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage orders, groups, and users</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <AdminNotifications />
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
