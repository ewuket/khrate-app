
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatus } from "@/types/order";

type FilterType = OrderStatus | "all";

interface OrdersFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const OrdersFilter = ({ filter, onFilterChange }: OrdersFilterProps) => {
  return (
    <div className="mb-8">
      <Tabs 
        defaultValue="all" 
        onValueChange={(value) => onFilterChange(value as FilterType)}
        value={filter}
      >
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrdersFilter;
