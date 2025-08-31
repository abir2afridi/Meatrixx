"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function OrderHistory({ orders, onReorder, onCancelOrder }: { orders: any[]; onReorder: (o: any) => void; onCancelOrder: (id: string) => void }) {
  if (!orders?.length) return <div className="p-4">No order history yet.</div>

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Order #{order.id}</div>
              <div className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</div>
              <Badge variant="outline" className="mt-2">{order.status}</Badge>
            </div>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={() => onReorder(order)}>Reorder</Button>
              <Button size="sm" variant="destructive" onClick={() => onCancelOrder(order.id)}>Cancel</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
