
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from "./PersonalInfoTab";
import AddressesTab from "./AddressesTab";
import SavedBundlesTab from "./SavedBundlesTab";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  profileData: {
    name: string;
    phone: string;
    email: string;
  };
  savedAddresses: Array<{
    id: number;
    name: string;
    address: string;
    isDefault: boolean;
  }>;
  savedBundles: Array<{
    id: number;
    name: string;
    items: string[];
    lastOrdered: string;
  }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: () => void;
}

const ProfileTabs = ({
  activeTab,
  setActiveTab,
  savedAddresses,
  savedBundles
}: ProfileTabsProps) => {
  return (
    <Tabs 
      defaultValue="personal" 
      className="space-y-8"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="saved">Saved Bundles</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="space-y-6">
        <PersonalInfoTab />
      </TabsContent>
      
      <TabsContent value="addresses" className="space-y-6">
        <AddressesTab savedAddresses={savedAddresses} />
      </TabsContent>
      
      <TabsContent value="saved" className="space-y-6">
        <SavedBundlesTab savedBundles={savedBundles} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
