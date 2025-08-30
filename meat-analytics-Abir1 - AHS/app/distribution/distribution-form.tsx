"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Distribution } from "@/data/mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  distribution: Distribution | null
  onSave: (data: Omit<Distribution, "id" | "createdAt" | "updatedAt">) => Promise<void> | void
  onCancel: () => void
}

export function DistributionForm({ distribution, onSave, onCancel }: Props) {
  const [open, setOpen] = useState(true)

  // Local state
  const [routeNumber, setRouteNumber] = useState("")
  const [driverName, setDriverName] = useState("")
  const [vehicleId, setVehicleId] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [distance, setDistance] = useState<number>(0)
  const [temperature, setTemperature] = useState<number>(0)
  const [scheduledDate, setScheduledDate] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [status, setStatus] = useState<Distribution["status"]>("Scheduled")
  const [gpsLocation, setGpsLocation] = useState<boolean>(false)
  const [productsText, setProductsText] = useState("")

  useEffect(() => {
    if (distribution) {
      setRouteNumber(distribution.routeNumber)
      setDriverName(distribution.driverName)
      setVehicleId(distribution.vehicleId)
      setOrigin(distribution.origin)
      setDestination(distribution.destination)
      setDistance(distribution.distance)
      setTemperature(distribution.temperature)
      setScheduledDate(distribution.scheduledDate)
      setEstimatedTime(distribution.estimatedTime)
      setStatus(distribution.status)
      setGpsLocation(Boolean(distribution.gpsLocation))
      setProductsText(
        distribution.products.map((p) => `${p.productName}:${p.quantity}`).join("\n")
      )
    }
  }, [distribution])

  const parsedProducts = useMemo(() => {
    const lines = productsText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    const items: { productName: string; quantity: number }[] = []
    for (const line of lines) {
      const [name, qtyStr] = line.split(":")
      if (!name) continue
      const qty = Number(qtyStr)
      items.push({ productName: name.trim(), quantity: Number.isFinite(qty) ? qty : 0 })
    }
    return items
  }, [productsText])

  const handleClose = () => {
    setOpen(false)
    onCancel()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      routeNumber,
      driverName,
      vehicleId,
      origin,
      destination,
      distance: Number(distance) || 0,
      temperature: Number(temperature) || 0,
      scheduledDate,
      estimatedTime,
      status,
      products: parsedProducts,
      gpsLocation,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? handleClose() : setOpen(o))}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{distribution ? "Edit Route" : "New Route"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="routeNumber">Route Number</Label>
              <Input id="routeNumber" value={routeNumber} onChange={(e) => setRouteNumber(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="driverName">Driver Name</Label>
              <Input id="driverName" value={driverName} onChange={(e) => setDriverName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input id="vehicleId" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="distance">Distance (km)</Label>
              <Input id="distance" type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input id="temperature" type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input id="scheduledDate" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input id="estimatedTime" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} required />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Distribution["status"]) }>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <Checkbox id="gps" checked={gpsLocation} onCheckedChange={(v) => setGpsLocation(Boolean(v))} />
              <Label htmlFor="gps">GPS Tracking Available</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="products">Products (one per line as name:quantity)</Label>
            <Textarea id="products" value={productsText} onChange={(e) => setProductsText(e.target.value)} rows={4} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
