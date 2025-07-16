
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfilePictureUpload = () => {
  const { user, profile, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // For now, we'll use a placeholder URL
    // In a real app, you'd upload to Supabase storage
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock URL (in real app, this would be from Supabase storage)
      const mockImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
      
      await updateProfile({
        profile_image_url: mockImageUrl
      });
      
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Picture
        </CardTitle>
        <CardDescription>
          Upload a profile picture to personalize your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={profile?.profile_image_url} 
              alt={profile?.full_name || 'Profile'} 
            />
            <AvatarFallback className="text-lg">
              {profile?.full_name ? getInitials(profile.full_name) : '?'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Label htmlFor="profilePicture" className="cursor-pointer">
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                disabled={uploading}
                className="w-full"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload New Picture"}
                </span>
              </Button>
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF (max 5MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
