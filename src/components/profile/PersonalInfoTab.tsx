
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PersonalInfoTabProps {
  profileData: {
    name: string;
    phone: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: () => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profileData,
  handleInputChange,
  handleSaveChanges
}) => {
  const { signOut, profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={profileData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={profileData.email}
            onChange={handleInputChange}
            placeholder="Enter your email" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            value={profileData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number" 
          />
        </div>
      </div>

      {/* Discount Status */}
      {profile?.discount_orders_remaining > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">🎉 Welcome Discount Active!</h3>
          <p className="text-green-700">
            You have {profile.discount_orders_remaining} orders remaining with 10% discount.
          </p>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button onClick={handleSaveChanges} className="bg-khrate-500 hover:bg-khrate-600">
          Save Changes
        </Button>
        
        <Button 
          onClick={signOut}
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
