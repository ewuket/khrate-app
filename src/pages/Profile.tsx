
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Clock, ShoppingBasket, LogOut } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-1">
                <div className="bg-khrate-100 rounded-full h-16 w-16 flex items-center justify-center">
                  <User className="h-8 w-8 text-khrate-500" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
                <p className="mt-1">Welcome back, Alex</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="Alex Johnson" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+233 55 123 4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input id="email" defaultValue="alex@example.com" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button className="bg-khrate-500 hover:bg-khrate-600">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Saved Addresses</CardTitle>
                    <Button className="bg-khrate-500 hover:bg-khrate-600">
                      Add New Address
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedAddresses.map(address => (
                      <Card key={address.id} className="border shadow-none">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{address.name}</h3>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Default</span>
                                )}
                              </div>
                              <div className="flex items-center mt-1 text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                {address.address}
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              {!address.isDefault && (
                                <Button variant="ghost" size="sm">Delete</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Saved Bundles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedBundles.map(bundle => (
                      <Card key={bundle.id} className="border shadow-none">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{bundle.name}</h3>
                              <div className="text-sm text-muted-foreground mt-1">
                                {bundle.items.join(", ")}
                              </div>
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                Last ordered: {new Date(bundle.lastOrdered).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center text-khrate-500 border-khrate-500 hover:bg-khrate-50"
                              >
                                <ShoppingBasket className="h-4 w-4 mr-1" />
                                Order Again
                              </Button>
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">Delete</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
