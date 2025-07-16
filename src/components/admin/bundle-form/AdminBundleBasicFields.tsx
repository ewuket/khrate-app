
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  title: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

interface AdminBundleBasicFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const AdminBundleBasicFields: React.FC<AdminBundleBasicFieldsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            placeholder="/placeholder.svg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (RWF)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="original_price">Original Price (RWF)</Label>
          <Input
            id="original_price"
            type="number"
            value={formData.original_price}
            onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || 0})}
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </>
  );
};

export default AdminBundleBasicFields;
