
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailyStats {
  date_created: string;
  bundle_orders: number;
  custom_orders: number;
  group_orders: number;
  total_orders: number;
  total_revenue: number;
}

interface AdminDailyStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dailyStats: DailyStats[] | undefined;
}

const AdminDailyStatsModal = ({ open, onOpenChange, dailyStats }: AdminDailyStatsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Order Statistics (Last 30 Days)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!dailyStats || dailyStats.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No daily statistics available</p>
          ) : (
            <div className="grid gap-4">
              {dailyStats.map((day, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {new Date(day.date_created).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{day.bundle_orders}</div>
                        <div className="text-sm text-gray-600">Bundle Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{day.custom_orders}</div>
                        <div className="text-sm text-gray-600">Custom Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{day.group_orders}</div>
                        <div className="text-sm text-gray-600">Group Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{day.total_orders}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {Number(day.total_revenue).toLocaleString()} RWF
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDailyStatsModal;
