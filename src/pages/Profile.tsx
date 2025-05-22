
import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    phone: "+233 55 123 4567",
    email: "alex@example.com"
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

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
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
    toast.success("Profile updated successfully!");
    // In a real app, you would save the data to a backend here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
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
      
      <Footer />
    </div>
  );
};

export default Profile;
