
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, MapPin, Tag, CreditCard, Phone, MapPinIcon, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface GroupCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any;
  onCheckoutComplete: () => void;
}

const GroupCheckoutModal: React.FC<GroupCheckoutModalProps> = ({
  isOpen,
  onClose,
  group,
  onCheckoutComplete
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    paymentMethod: 'momo',
    deliveryAddress: '',
    deliveryDate: '',
    timeSlot: 'morning',
    specialInstructions: ''
  });

  if (!group) return null;

  const qualifiesForDiscount = (group.member_count || 0) >= group.min_participants;
  const originalPrice = group.total_amount || 0;
  const discountAmount = qualifiesForDiscount ? (originalPrice * group.discount_percentage) / 100 : 0;
  const finalPrice = originalPrice - discountAmount;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = async () => {
    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      toast.error('Delivery address is required');
      return;
    }
    if (!formData.deliveryDate) {
      toast.error('Delivery date is required');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payment successful! Welcome to the group!');
      onCheckoutComplete();
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Complete Group Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Group Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                {group.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{group.location || 'Location TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-500" />
                  <span>{group.discount_percentage}% discount</span>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>RWF {originalPrice.toLocaleString()}</span>
                  </div>
                  {qualifiesForDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Group Discount ({group.discount_percentage}%):</span>
                      <span>-RWF {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Your Total:</span>
                    <span className="text-khrate-600">RWF {finalPrice.toLocaleString()}</span>
                  </div>
                </div>
                {qualifiesForDiscount && (
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    ✓ Discount Applied
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment & Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Method */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momo">Mobile Money (MoMo)</SelectItem>
                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Delivery Address
                </Label>
                <Textarea
                  placeholder="Enter your complete delivery address"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Delivery Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Delivery Date
                  </Label>
                  <Input
                    type="date"
                    min={getTomorrowDate()}
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Slot</Label>
                  <Select 
                    value={formData.timeSlot} 
                    onValueChange={(value) => handleInputChange('timeSlot', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label>Special Instructions (Optional)</Label>
                <Textarea
                  placeholder="Any special delivery instructions..."
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {formData.paymentMethod === "momo" && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800 font-medium">Payment Instructions</p>
                <p className="text-xs text-blue-700 mt-1">
                  Send payment to: <span className="font-bold">0795754391</span>
                  <br />
                  Your order will be confirmed once payment is received.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              className="flex-1 bg-khrate-500 hover:bg-khrate-600"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay RWF ${finalPrice.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupCheckoutModal;
