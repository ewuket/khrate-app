import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage 
                    src={profile?.profile_image_url} 
                    alt={profile?.full_name || 'Profile'} 
                  />
                  <AvatarFallback className="text-lg bg-khrate-100 text-khrate-600">
                    {profile?.full_name ? getInitials(profile.full_name) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-khrate-500 text-white rounded-full p-1 cursor-pointer hover:bg-khrate-600 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <h3 className="font-semibold text-lg mt-4">
                {profile?.full_name || user?.user_metadata?.full_name || 'User'}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{user?.email}</span>
              </div>
              
              {(profile?.phone || user?.user_metadata?.phone_number) && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{profile?.phone || user.user_metadata.phone_number}</span>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <p className="text-sm text-gray-600">
                          {order.created_at ? formatDate(order.created_at) : 'Recent order'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-khrate-600">
                          {formatPrice(order.total_amount)}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <span>Items: {order.items.map((item: any) => item.name || item.product_name).join(', ')}</span>
                      ) : (
                        <span>Order details</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
