
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FormData {
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

interface AdminBundleFormSettingsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const AdminBundleFormSettings: React.FC<AdminBundleFormSettingsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
        />
        <Label htmlFor="is_featured">Featured</Label>
      </div>
    </div>
  );
};

export default AdminBundleFormSettings;
