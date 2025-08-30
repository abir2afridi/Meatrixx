"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Order } from "@/data/mock-data"

export default function OrderTable({
  orders,
  loading,
  onUpdateStatus,
}: {
  orders: (Order & { vendorName?: string; productName?: string })[]
  loading: boolean
  onUpdateStatus: (id: string, status: Order["status"]) => void
}) {
  if (loading) return <div className="p-4">Loading orders...</div>
  if (!orders?.length) return <div className="p-4">No orders found</div>

  return (
    <Card className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.vendorName}</TableCell>
              <TableCell>{o.productName}</TableCell>
              <TableCell>{o.quantity}</TableCell>
              <TableCell>৳{o.unitPrice}</TableCell>
              <TableCell>৳{o.totalAmount}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>{o.orderDate}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => onUpdateStatus(o.id, "Processing")}>Process</Button>
                <Button size="sm" variant="outline" onClick={() => onUpdateStatus(o.id, "Shipped")}>Ship</Button>
                <Button size="sm" onClick={() => onUpdateStatus(o.id, "Delivered")}>Deliver</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
