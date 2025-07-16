
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user, isAuthenticated, updateUserProfile, openAuthModal } = useAuth();
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
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: "",
        email: user.email || ""
      });
      
      // Load profile image if it exists for this user
      const savedProfileImage = user.profileImage || localStorage.getItem(`profileImage_${user.id}`);
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
    }
  }, [user]);

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
        
        // Save to localStorage with user ID
        localStorage.setItem(`profileImage_${user.id}`, imageData);
        
        // Update user profile
        updateUserProfile({ profileImage: imageData });
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
    updateUserProfile({
      name: profileData.name
    });
    
    toast.success("Profile updated successfully!");
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

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
