
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePictureUpload from "./ProfilePictureUpload";
import PasswordChangeForm from "./PasswordChangeForm";

const PersonalInfoTab = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || ""
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.fullName,
        phone: formData.phone
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.full_name || "",
      email: profile?.email || "",
      phone: profile?.phone || ""
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <ProfilePictureUpload />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Manage your account details and personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                placeholder="Enter your email"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSave}
                  className="bg-khrate-500 hover:bg-khrate-600"
                >
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <PasswordChangeForm />
    </div>
  );
};

export default PersonalInfoTab;
