"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Filter, Download, MapPin, Truck, Clock, Thermometer } from "lucide-react"
import { mockApi } from "@/services/mock-api"
import type { Distribution } from "@/data/mock-data"
import { DistributionForm } from "./distribution-form"
import { DistributionFilterSheet, type DistributionFilters } from "@/components/filters/distribution-filter-sheet"

export function DistributionContent() {
  const [distribution, setDistribution] = useState<Distribution[]>([])
  const [filteredDistribution, setFilteredDistribution] = useState<Distribution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingDistribution, setEditingDistribution] = useState<Distribution | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<DistributionFilters>({
    statuses: [],
    drivers: [],
    origins: [],
    destinations: [],
    dateFrom: "",
    dateTo: "",
  })
  const [trackingRoute, setTrackingRoute] = useState<Distribution | null>(null)
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)

  const allStatuses = useMemo(
    () => Array.from(new Set(distribution.map((d) => d.status))),
    [distribution],
  )
  const allDrivers = useMemo(
    () => Array.from(new Set(distribution.map((d) => d.driverName))).filter(Boolean),
    [distribution],
  )
  const allOrigins = useMemo(
    () => Array.from(new Set(distribution.map((d) => d.origin))).filter(Boolean),
    [distribution],
  )
  const allDestinations = useMemo(
    () => Array.from(new Set(distribution.map((d) => d.destination))).filter(Boolean),
    [distribution],
  )

  useEffect(() => {
    loadDistribution()
  }, [])

  useEffect(() => {
    const q = searchTerm.toLowerCase()
    let filtered = distribution.filter((route) => {
      const matchesSearch =
        route.routeNumber.toLowerCase().includes(q) ||
        route.driverName.toLowerCase().includes(q) ||
        route.origin.toLowerCase().includes(q) ||
        route.destination.toLowerCase().includes(q)

      const statusOk = !filters.statuses?.length || filters.statuses.includes(route.status)
      const driverOk = !filters.drivers?.length || filters.drivers.includes(route.driverName)
      const originOk = !filters.origins?.length || filters.origins.includes(route.origin)
      const destOk = !filters.destinations?.length || filters.destinations.includes(route.destination)

      const fromOk = !filters.dateFrom || route.scheduledDate >= filters.dateFrom!
      const toOk = !filters.dateTo || route.scheduledDate <= filters.dateTo!

      return matchesSearch && statusOk && driverOk && originOk && destOk && fromOk && toOk
    })
    setFilteredDistribution(filtered)
  }, [distribution, searchTerm, filters])

  const loadDistribution = async () => {
    try {
      const data = await mockApi.getDistribution()
      setDistribution(data)
    } catch (error) {
      console.error("Failed to load distribution:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: Omit<Distribution, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingDistribution) {
        await mockApi.updateDistribution(editingDistribution.id, data)
      } else {
        await mockApi.createDistribution(data)
      }
      await loadDistribution()
      setShowForm(false)
      setEditingDistribution(null)
    } catch (error) {
      console.error("Failed to save distribution:", error)
    }
  }

  const handleTrackRoute = (route: Distribution) => {
    setTrackingRoute(route)
    setTrackingDialogOpen(true)
  }

  const statusProgressMap: Record<Distribution["status"], number> = {
    Scheduled: 10,
    "In Transit": 65,
    Delivered: 100,
    Delayed: 45,
    Cancelled: 0,
  }

  const trackingProgress = useMemo(() => {
    if (!trackingRoute) return 0
    return statusProgressMap[trackingRoute.status] ?? 0
  }, [trackingRoute])

  const trackingTimeline = useMemo(() => {
    if (!trackingRoute) return [] as { label: string; description: string; state: "pending" | "current" | "completed" | "issue" }[]

    if (trackingRoute.status === "Cancelled") {
      return [
        {
          label: "Cancelled",
          description: "This route was cancelled. Please reschedule or contact the logistics team for assistance.",
          state: "issue" as const,
        },
      ]
    }

    const scheduledDate = new Date(trackingRoute.scheduledDate)
    const baseTimeline: { label: string; description: string; state: "pending" | "current" | "completed" | "issue" }[] = [
      {
        label: "Scheduled",
        description: `Departure from ${trackingRoute.origin} on ${scheduledDate.toLocaleDateString()}`,
        state: "pending",
      },
      {
        label: "In Transit",
        description: `Driver ${trackingRoute.driverName} is en route to ${trackingRoute.destination}.`,
        state: "pending",
      },
      {
        label: "Delivered",
        description: `Estimated delivery time: ${trackingRoute.estimatedTime}.`,
        state: "pending",
      },
    ]

    switch (trackingRoute.status) {
      case "Scheduled":
        baseTimeline[0].state = "current"
        break
      case "In Transit":
        baseTimeline[0].state = "completed"
        baseTimeline[1].state = "current"
        break
      case "Delayed":
        baseTimeline[0].state = "completed"
        baseTimeline[1].state = "issue"
        break
      case "Delivered":
        baseTimeline[0].state = "completed"
        baseTimeline[1].state = "completed"
        baseTimeline[2].state = "current"
        break
      default:
        break
    }

    return baseTimeline
  }, [trackingRoute])

  const handleTrackingDialogChange = (open: boolean) => {
    setTrackingDialogOpen(open)
    if (!open) {
      setTrackingRoute(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Delayed":
        return "bg-orange-100 text-orange-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading distribution data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Distribution Tracking</h1>
          <p className="text-muted-foreground">Monitor delivery routes, vehicles, and logistics</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Route
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{distribution.length}</div>
                <div className="text-sm text-muted-foreground">Total Routes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {distribution.filter((d) => d.status === "In Transit").length}
                </div>
                <div className="text-sm text-muted-foreground">In Transit</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {distribution.filter((d) => d.status === "Delivered").length}
                </div>
                <div className="text-sm text-muted-foreground">Delivered</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {distribution.length > 0
                    ? Math.round(distribution.reduce((sum, d) => sum + d.temperature, 0) / distribution.length)
                    : 0}
                  °C
                </div>
                <div className="text-sm text-muted-foreground">Avg Temp</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by route, driver, origin, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setFilterOpen(true)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDistribution.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{route.routeNumber}</CardTitle>
                <Badge className={getStatusColor(route.status)}>{route.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Driver: {route.driverName} • Vehicle: {route.vehicleId}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{route.origin}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{route.destination}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Distance</div>
                  <div className="text-muted-foreground">{route.distance} km</div>
                </div>
                <div>
                  <div className="font-medium">Temperature</div>
                  <div className="text-muted-foreground">{route.temperature}°C</div>
                </div>
                <div>
                  <div className="font-medium">Scheduled</div>
                  <div className="text-muted-foreground">{new Date(route.scheduledDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-medium">Est. Time</div>
                  <div className="text-muted-foreground">{route.estimatedTime}</div>
                </div>
              </div>

              <div>
                <div className="font-medium text-sm mb-2">Products ({route.products.length})</div>
                <div className="space-y-1">
                  {route.products.slice(0, 2).map((product, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{product.productName}</span>
                      <span className="text-muted-foreground">{product.quantity} units</span>
                    </div>
                  ))}
                  {route.products.length > 2 && (
                    <div className="text-sm text-muted-foreground">+{route.products.length - 2} more products</div>
                  )}
                </div>
              </div>

              {route.gpsLocation && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Live tracking available</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleTrackRoute(route)}
                >
                  Track Route
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingDistribution(route)
                    setShowForm(true)
                  }}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <DistributionForm
          distribution={editingDistribution}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingDistribution(null)
          }}
        />
      )}

      {/* Filters Sheet */}
      <DistributionFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        allStatuses={allStatuses}
        allDrivers={allDrivers}
        allOrigins={allOrigins}
        allDestinations={allDestinations}
        value={filters}
        onChange={setFilters}
        onApply={() => setFilterOpen(false)}
        onReset={() =>
          setFilters({ statuses: [], drivers: [], origins: [], destinations: [], dateFrom: "", dateTo: "" })
        }
      />

      {trackingRoute && (
        <Dialog open={trackingDialogOpen} onOpenChange={handleTrackingDialogChange}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Route Tracking • {trackingRoute.routeNumber}</DialogTitle>
              <DialogDescription>
                Monitoring delivery from {trackingRoute.origin} to {trackingRoute.destination}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Driver</p>
                  <p className="font-medium">{trackingRoute.driverName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{trackingRoute.vehicleId}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Distance</p>
                  <p className="font-medium">{trackingRoute.distance} km</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(trackingRoute.status)}>{trackingRoute.status}</Badge>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold">{trackingProgress}%</span>
                </div>
                <Progress value={trackingProgress} className="h-2" />
              </div>

              {trackingRoute.gpsLocation ? (
                <div className="rounded-lg border border-green-200 bg-green-50/60 p-3 text-sm text-green-900">
                  Live GPS ping received. Last update {new Date().toLocaleTimeString()}.
                </div>
              ) : (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50/60 p-3 text-sm text-yellow-900">
                  GPS tracking is not available for this route. Status updates rely on driver check-ins.
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Route timeline</p>
                <div className="space-y-2">
                  {trackingTimeline.map((item, index) => {
                    const indicatorClass = (() => {
                      switch (item.state) {
                        case "completed":
                          return "bg-emerald-500"
                        case "current":
                          return "bg-blue-500"
                        case "issue":
                          return "bg-amber-500"
                        default:
                          return "bg-muted-foreground/50"
                      }
                    })()

                    return (
                      <div key={`${item.label}-${index}`} className="relative pl-6">
                        <span className={`absolute left-0 top-1 h-2 w-2 rounded-full ${indicatorClass}`} />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{item.label}</p>
                            {item.state === "issue" && (
                              <Badge variant="outline" className="border-amber-300 text-amber-600">
                                Attention
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        {index < trackingTimeline.length - 1 && <Separator className="my-2" />}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium text-muted-foreground">Products on board</p>
                <div className="rounded-md border bg-card">
                  {trackingRoute.products.map((product, index) => (
                    <div
                      key={`${product.productName}-${index}`}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span>{product.productName}</span>
                      <span className="text-muted-foreground">{product.quantity} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleTrackingDialogChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
