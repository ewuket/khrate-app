
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Clock, Plus, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";

// Sample groups data
const initialGroups = [
  {
    id: 1,
    name: "Campus Hostel Group",
    location: "University Campus",
    members: 3,
    maxMembers: 5,
    discount: "15%",
    timeLeft: "12 hours",
    type: "local",
    groceries: [
      "Rice (5kg)", "Beans (2kg)", "Tomatoes (10)", 
      "Onions (5)", "Cooking Oil (2L)", "Salt (1kg)"
    ],
    price: 15000
  },
  {
    id: 2,
    name: "Weekend Essentials",
    location: "Open Group",
    members: 8,
    maxMembers: 10,
    discount: "25%",
    timeLeft: "1 day",
    type: "open",
    groceries: [
      "Rice (10kg)", "Beans (5kg)", "Tomatoes (20)", 
      "Onions (10)", "Cooking Oil (5L)", "Salt (2kg)",
      "Eggs (30)", "Bread (5)", "Milk (5L)"
    ],
    price: 25000
  },
  {
    id: 3,
    name: "Family Bundle",
    location: "Open Group",
    members: 4,
    maxMembers: 8,
    discount: "20%",
    timeLeft: "2 days",
    type: "open",
    groceries: [
      "Rice (15kg)", "Beans (8kg)", "Tomatoes (30)", 
      "Onions (15)", "Cooking Oil (8L)", "Salt (3kg)",
      "Eggs (60)", "Bread (10)", "Milk (10L)",
      "Flour (5kg)", "Sugar (5kg)", "Coffee (1kg)"
    ],
    price: 35000
  },
  {
    id: 4,
    name: "Riverside Apartments",
    location: "Riverside, Block C",
    members: 2,
    maxMembers: 6,
    discount: "15%",
    timeLeft: "1 day",
    type: "local",
    groceries: [
      "Rice (8kg)", "Beans (4kg)", "Tomatoes (15)", 
      "Onions (8)", "Cooking Oil (3L)", "Salt (1.5kg)",
      "Eggs (30)", "Bread (5)"
    ],
    price: 20000
  },
  {
    id: 5,
    name: "Office Lunch Club",
    location: "Tech Park, Building 4",
    members: 6,
    maxMembers: 6,
    discount: "20%",
    timeLeft: "Completed",
    type: "local",
    groceries: [
      "Bread (10)", "Cheese (2kg)", "Tomatoes (15)", 
      "Lettuce (5)", "Cucumbers (10)", "Ham (2kg)",
      "Mayonnaise (1L)", "Mustard (500ml)"
    ],
    price: 18000
  }
];

const GroupBuy = () => {
  const [groupType, setGroupType] = useState("all");
  const [groups, setGroups] = useState(initialGroups);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupDetailOpen, setGroupDetailOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    location: "",
    maxMembers: 5,
    type: "open",
    discount: "15%",
    groceries: ""
  });
  
  const { addToCart } = useCart();
  
  const filteredGroups = groupType === "all" 
    ? groups 
    : groups.filter(group => group.type === groupType);
    
  const handleJoinGroup = (group: any) => {
    if (group.members === group.maxMembers || group.timeLeft === "Completed") {
      toast.error("This group is already full or completed!");
      return;
    }
    
    setSelectedGroup(group);
    setGroupDetailOpen(true);
  };
  
  const handleProceedToCheckout = () => {
    if (!selectedGroup) return;
    
    setGroupDetailOpen(false);
    setCheckoutOpen(true);
  };
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setCheckoutOpen(false);
      
      if (selectedGroup) {
        // Update group members count
        setGroups(groups.map(group => 
          group.id === selectedGroup.id ? 
          { 
            ...group, 
            members: group.members + 1,
            // If group becomes full after this join, mark it as "Processing"
            timeLeft: group.members + 1 === group.maxMembers ? "Processing delivery" : group.timeLeft
          } : 
          group
        ));
        
        // If the group becomes full, simulate delivery process
        if (selectedGroup.members + 1 === selectedGroup.maxMembers) {
          setTimeout(() => {
            // Reset the group for new users
            setGroups(groups.map(group => 
              group.id === selectedGroup.id ? 
              { 
                ...group, 
                members: 0,
                timeLeft: "2 days" // Reset time
              } : 
              group
            ));
            
            toast.success(`Group "${selectedGroup.name}" has been delivered and reset for new members!`);
          }, 10000); // 10 seconds to simulate delivery process
        }
      }
      
      toast.success("You've joined the group successfully! Payment complete.");
    }, 2000);
  };
  
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const groceriesList = newGroup.groceries.split(',').map(item => item.trim());
    
    const newGroupEntry = {
      id: groups.length + 1,
      name: newGroup.name,
      location: newGroup.location,
      members: 1, // Creator is the first member
      maxMembers: Number(newGroup.maxMembers),
      discount: newGroup.discount,
      timeLeft: "2 days",
      type: newGroup.type as "local" | "open",
      groceries: groceriesList,
      price: Math.floor(Math.random() * 20000) + 15000 // Random price between 15000-35000
    };
    
    setGroups([...groups, newGroupEntry]);
    setCreateGroupOpen(false);
    toast.success("Your group has been created!");
    
    // Reset form
    setNewGroup({
      name: "",
      location: "",
      maxMembers: 5,
      type: "open",
      discount: "15%",
      groceries: ""
    });
  };
  
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
                  <p className="font-medium">Pay to confirm your spot</p>
                </div>
                <div className="p-4">
                  <div className="bg-khrate-100 rounded-full h-10 w-10 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold text-khrate-700">3</span>
                  </div>
                  <p className="font-medium">Get your groceries when group is full</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  className="bg-khrate-500 hover:bg-khrate-600"
                  onClick={() => setCreateGroupOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Group
                </Button>
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
                        disabled={group.members === group.maxMembers || group.timeLeft === "Completed" || group.timeLeft === "Processing delivery"}
                        onClick={() => handleJoinGroup(group)}
                      >
                        {group.members === group.maxMembers || group.timeLeft === "Completed" ? 
                          "Group Full" : 
                          group.timeLeft === "Processing delivery" ? 
                          "Processing Delivery" : 
                          "View & Join Group"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a New Group</DialogTitle>
            <DialogDescription>
              Set up your group details to get started
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateGroup}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input 
                  id="name" 
                  value={newGroup.name} 
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={newGroup.location} 
                  onChange={(e) => setNewGroup({ ...newGroup, location: e.target.value })} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Members</Label>
                <Input 
                  id="maxMembers" 
                  type="number" 
                  min={2}
                  max={20}
                  value={newGroup.maxMembers} 
                  onChange={(e) => setNewGroup({ ...newGroup, maxMembers: Number(e.target.value) })} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groceries">Groceries (comma-separated)</Label>
                <Input 
                  id="groceries" 
                  value={newGroup.groceries} 
                  onChange={(e) => setNewGroup({ ...newGroup, groceries: e.target.value })} 
                  placeholder="Rice (5kg), Beans (2kg), Tomatoes (10), etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Group Type</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="groupType"
                      value="open"
                      checked={newGroup.type === "open"}
                      onChange={() => setNewGroup({ ...newGroup, type: "open" })}
                      className="rounded text-khrate-500"
                    />
                    <span>Open Group</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="groupType"
                      value="local"
                      checked={newGroup.type === "local"}
                      onChange={() => setNewGroup({ ...newGroup, type: "local" })}
                      className="rounded text-khrate-500"
                    />
                    <span>Local Group</span>
                  </label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateGroupOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-khrate-500 hover:bg-khrate-600">Create Group</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={groupDetailOpen} onOpenChange={setGroupDetailOpen}>
        <DialogContent className="sm:max-w-[525px]">
          {selectedGroup && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGroup.name}</DialogTitle>
                <DialogDescription>
                  Group details and grocery information
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Group Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGroup.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGroup.members}/{selectedGroup.maxMembers} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGroup.timeLeft}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGroup.discount} discount</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Groceries Included</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedGroup.groceries.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-khrate-500"></div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price per person:</span>
                      <span className="font-bold text-khrate-500">{selectedGroup.price.toLocaleString()} RWF</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setGroupDetailOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-khrate-500 hover:bg-khrate-600"
                  onClick={handleProceedToCheckout}
                >
                  Join & Proceed to Payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Group Join Payment</DialogTitle>
            <DialogDescription>
              Pay now to confirm your spot in the group
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePayment}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <RadioGroup 
                  id="payment-method" 
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="mtn" id="mtn" />
                    <Label htmlFor="mtn" className="flex items-center">
                      <span className="font-medium">MTN MoMo</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="equity" id="equity" />
                    <Label htmlFor="equity" className="flex items-center">
                      <span className="font-medium">Equity Bank</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="bk" id="bk" />
                    <Label htmlFor="bk" className="flex items-center">
                      <span className="font-medium">Bank of Kigali</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="im" id="im" />
                    <Label htmlFor="im" className="flex items-center">
                      <span className="font-medium">I&M Bank</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === "mtn" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Your MTN number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>{selectedGroup ? selectedGroup.price.toLocaleString() : 0} RWF</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={processingPayment}
                className="bg-khrate-500 hover:bg-khrate-600"
              >
                {processingPayment ? "Processing..." : "Pay Now"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default GroupBuy;
