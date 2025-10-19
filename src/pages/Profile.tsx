
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useAuth } from "@/contexts/AuthContext";
import LoyaltyCard from "@/components/loyalty/LoyaltyCard";
import ReferralCard from "@/components/referral/ReferralCard";

const Profile = () => {
  const { user, profile, isAuthenticated, updateProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample saved addresses
  const savedAddresses = [
    {
      id: 1,
      name: "Home",
      address: "123 University Hostel, Campus Road",
      isDefault: true
    },
    {
      id: 2,
      name: "Office",
      address: "45 Tech Park, Innovation Street",
      isDefault: false
    }
  ];
  
  // Sample saved bundles
  const savedBundles = [
    {
      id: 1,
      name: "My Weekly Bundle",
      items: ["Rice", "Beans", "Tomatoes", "Onions", "Oil", "Salt"],
      lastOrdered: "2025-05-10"
    },
    {
      id: 2,
      name: "Breakfast Bundle",
      items: ["Bread", "Eggs", "Milk", "Sugar", "Coffee"],
      lastOrdered: "2025-05-01"
    }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to view your profile");
      navigate("/");
      setTimeout(() => {
        openAuthModal();
      }, 500);
    }
  }, [isAuthenticated, navigate, openAuthModal]);

  // Load user data
  useEffect(() => {
    if (user && profile) {
      setProfileData({
        name: profile.full_name || "",
        phone: profile.phone || "",
        email: user.email || ""
      });
      
      // Load profile image if it exists
      if (profile.profile_image_url) {
        setProfileImage(profile.profile_image_url);
      }
    }
  }, [user, profile]);

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        
        // Update user profile
        updateProfile({ profile_image_url: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSaveChanges = () => {
    if (!user) return;
    
    // Update user profile
    updateProfile({
      full_name: profileData.name,
      phone: profileData.phone
    });
    
    toast.success("Profile updated successfully!");
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <ProfileHeader
          profileData={profileData}
          profileImage={profileImage}
          handleProfileImageClick={handleProfileImageClick}
          handleFileChange={handleFileChange}
          fileInputRef={fileInputRef}
        />
        
        <section className="py-12">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <LoyaltyCard />
              <ReferralCard />
              <div className="bg-gradient-to-br from-muted/50 to-background rounded-lg border p-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">
                    {profile?.total_orders || 0}
                  </p>
                  <p className="text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </div>
            
            <ProfileTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profileData={profileData}
              savedAddresses={savedAddresses}
              savedBundles={savedBundles}
              handleInputChange={handleInputChange}
              handleSaveChanges={handleSaveChanges}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
