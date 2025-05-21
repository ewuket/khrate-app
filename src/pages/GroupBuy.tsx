
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Clock } from "lucide-react";

// Sample groups data
const groups = [
  {
    id: 1,
    name: "Campus Hostel Group",
    location: "University Campus",
    members: 3,
    maxMembers: 5,
    discount: "15%",
    timeLeft: "12 hours",
    type: "local"
  },
  {
    id: 2,
    name: "Weekend Essentials",
    location: "Open Group",
    members: 8,
    maxMembers: 10,
    discount: "25%",
    timeLeft: "1 day",
    type: "open"
  },
  {
    id: 3,
    name: "Family Bundle",
    location: "Open Group",
    members: 4,
    maxMembers: 8,
    discount: "20%",
    timeLeft: "2 days",
    type: "open"
  },
  {
    id: 4,
    name: "Riverside Apartments",
    location: "Riverside, Block C",
    members: 2,
    maxMembers: 6,
    discount: "15%",
    timeLeft: "1 day",
    type: "local"
  },
  {
    id: 5,
    name: "Office Lunch Club",
    location: "Tech Park, Building 4",
    members: 6,
    maxMembers: 6,
    discount: "20%",
    timeLeft: "Completed",
    type: "local"
  }
];

const GroupBuy = () => {
  const [groupType, setGroupType] = useState("all");
  
  const filteredGroups = groupType === "all" 
    ? groups 
    : groups.filter(group => group.type === groupType);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-khrate-500 to-khrate-600 py-12 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Group Buy</h1>
            <p className="mt-2 max-w-lg">
              Join forces with others to unlock bigger discounts
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto">
            <div className="bg-khrate-50 border border-khrate-100 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">How Group Buy Works</h2>
              <p className="text-muted-foreground mb-4">
                Join existing groups or create your own to enjoy bulk buying discounts. Once a group reaches its member threshold, everyone gets the discount!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-khrate-700">1</span>
                  </div>
                  <p className="font-medium">Join a group or create your own</p>
                </div>
                <div className="p-4">
                  <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-khrate-700">2</span>
                  </div>
                  <p className="font-medium">Select your grocery items</p>
                </div>
                <div className="p-4">
                  <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-khrate-700">3</span>
                  </div>
                  <p className="font-medium">Checkout with group discount</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button className="bg-khrate-500 hover:bg-khrate-600">Create New Group</Button>
              </div>
            </div>
            
            <div className="mb-8">
              <Tabs 
                defaultValue="all" 
                onValueChange={setGroupType}
                value={groupType}
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Groups</TabsTrigger>
                  <TabsTrigger value="open">Open Groups</TabsTrigger>
                  <TabsTrigger value="local">Local Groups</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <Card key={group.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {group.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-muted-foreground">Group Progress</span>
                          <span className="font-medium">{group.members}/{group.maxMembers} members</span>
                        </div>
                        <Progress 
                          value={(group.members / group.maxMembers) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{group.maxMembers - group.members} spots left</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{group.timeLeft}</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 text-green-700 py-1.5 px-3 rounded-lg text-center font-medium">
                        {group.discount} discount when full
                      </div>
                      
                      <Button 
                        className="w-full bg-khrate-500 hover:bg-khrate-600"
                        disabled={group.members === group.maxMembers || group.timeLeft === "Completed"}
                      >
                        {group.members === group.maxMembers || group.timeLeft === "Completed" ? "Group Full" : "Join Group"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupBuy;
