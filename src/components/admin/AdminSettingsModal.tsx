
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose }) => {
  const { adminUser } = useAdmin();
  const [settings, setSettings] = useState({
    email: adminUser?.email || '',
    notifications: true,
    autoRefresh: true,
    darkMode: false,
    itemsPerPage: 10
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    toast.success('Settings saved successfully!');
    onClose();
  };

  const handleReset = () => {
    setSettings({
      email: adminUser?.email || '',
      notifications: true,
      autoRefresh: true,
      darkMode: false,
      itemsPerPage: 10
    });
    toast.info('Settings reset to defaults');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              disabled
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications for new orders and group activities</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoRefresh">Auto Refresh Dashboard</Label>
                <p className="text-sm text-gray-500">Automatically refresh dashboard data every 30 seconds</p>
              </div>
              <Switch
                id="autoRefresh"
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-gray-500">Switch to dark theme (coming soon)</p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemsPerPage">Items per Page</Label>
            <Input
              id="itemsPerPage"
              type="number"
              min="5"
              max="50"
              value={settings.itemsPerPage}
              onChange={(e) => setSettings({ ...settings, itemsPerPage: parseInt(e.target.value) || 10 })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettingsModal;
