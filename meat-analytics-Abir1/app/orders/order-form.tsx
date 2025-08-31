"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/data/mock-data"

export default function OrderForm({ onSubmit, onCancel }: { onSubmit: (o: Omit<Order, "id">) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Omit<Order, "id">>({
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    status: "Pending",
    orderDate: new Date().toISOString().split("T")[0],
    vendorName: "Custom Vendor" as any,
    productName: "Custom Product" as any,
  })

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>New Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Vendor" value={(form as any).vendorName}
          onChange={(e) => setForm((f) => ({ ...f, vendorName: e.target.value } as any))} />
        <Input placeholder="Product" value={(form as any).productName}
          onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value } as any))} />
        <Input type="number" placeholder="Quantity" value={form.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value), totalAmount: Number(e.target.value) * f.unitPrice }))} />
        <Input type="number" placeholder="Unit Price" value={form.unitPrice}
          onChange={(e) => setForm((f) => ({ ...f, unitPrice: Number(e.target.value), totalAmount: f.quantity * Number(e.target.value) }))} />
        <div className="flex justify-between">
          <span>Total</span>
          <span>৳{form.totalAmount}</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSubmit(form)}>Create</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}
