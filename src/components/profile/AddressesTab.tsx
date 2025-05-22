
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface AddressType {
  id: number;
  name: string;
  address: string;
  isDefault: boolean;
}

interface AddressesTabProps {
  savedAddresses: AddressType[];
}

const AddressesTab = ({ savedAddresses }: AddressesTabProps) => {
  return (
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
  );
};

export default AddressesTab;
