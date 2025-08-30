"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

const mockOrders = [
  {
    id: "ORD-001",
    status: "Processing",
    orderDate: new Date().toISOString(),
    total: 1250,
    items: [
      { name: "Chicken Breast", quantity: 2, price: 500 },
      { name: "Beef Steak", quantity: 1, price: 750 }
    ],
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ORD-002",
    status: "Delivered",
    orderDate: new Date(Date.now() - 86400000).toISOString(),
    total: 2000,
    items: [
      { name: "Lamb Chops", quantity: 1, price: 1200 },
      { name: "Chicken Wings", quantity: 2, price: 400 }
    ],
    estimatedDelivery: new Date(Date.now() - 86400000).toISOString()
  }
];

export default function MyOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <Badge className="mt-2">{order.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">৳{order.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/orders`}>
                    <Button variant="outline" className="w-full justify-between">
                      Track Order <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
