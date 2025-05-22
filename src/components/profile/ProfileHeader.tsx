
import { useState, useRef } from "react";
import { User, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  profileData: {
    name: string;
    phone: string;
    email: string;
  };
  profileImage: string | null;
  handleProfileImageClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProfileHeader = ({
  profileData,
  profileImage,
  handleProfileImageClick,
  handleFileChange,
  fileInputRef
}: ProfileHeaderProps) => {
  return (
    <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
      <div className="container mx-auto">
        <div className="flex items-center gap-4">
          <div 
            className="relative cursor-pointer"
            onClick={handleProfileImageClick}
          >
            <Avatar className="h-20 w-20 border-2 border-white">
              <AvatarImage src={profileImage || undefined} />
              <AvatarFallback className="bg-khrate-100">
                <User className="h-10 w-10 text-khrate-500" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
              <Upload className="h-4 w-4 text-khrate-500" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
            <p className="mt-1">Welcome back, {profileData.name.split(" ")[0]}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
