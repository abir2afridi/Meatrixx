"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle } from "lucide-react"

export function OrderTracking({ order }: { order: any }) {
  const fmt = (d?: string) => {
    if (!d) return "";
    try {
      return new Date(d).toISOString().split("T")[0];
    } catch {
      return d;
    }
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order Status</CardTitle>
            <Badge className="mt-2">{order.status}</Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Order Placed</p>
            <p>{fmt(order.orderDate)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Order Updates</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">{fmt(order.orderDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-muted-foreground">{fmt(order.orderDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Order {order.status}</p>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: {order.estimatedDelivery ? fmt(order.estimatedDelivery) : "TBD"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
