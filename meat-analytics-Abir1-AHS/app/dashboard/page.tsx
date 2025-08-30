"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Package, Users, ShoppingCart, TrendingUp, DollarSign, Plus, FileDown, UserPlus, Truck, MapPin, FileText, UserCheck, Store } from "lucide-react"
import { mockApi } from "@/services/mock-api"
import { useAuth } from "@/hooks/use-auth"

interface KPIData {
  totalProducts: number
  totalVendors: number
  totalOrders: number
  activeOrders: number
  fastestSellingProduct: string
  topSellingRegion: string
  avgFCR: number
  avgWeight: number
  avgRearingDays: number
  avgWholesalePrice: number
  avgRetailPrice: number
  totalRevenue: number
  monthlyGrowthRate: number
  weeklyOrderGrowth: number
}

export default function DashboardHome() {
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    productDistribution: [] as any[],
    inventoryLevels: [] as any[],
    regionSales: [] as any[],
    productSales: [] as any[],
  })
  const [openModals, setOpenModals] = useState({
    addProduct: false,
    newOrder: false,
    addVendor: false,
    scheduleDelivery: false,
    newPurchase: false,
    newRecord: false,
    addLocation: false,
    newAgentOrder: false,
    newSale: false,
    newVendorOrder: false,
  })
  const { user } = useAuth()

  const [productForm, setProductForm] = useState({
    name: "",
    type: "",
    wholesalePrice: "",
    retailPrice: "",
    description: "",
    weight: "",
    fcr: "",
    rearingDays: "",
    district: "",
  })

  const [orderForm, setOrderForm] = useState({
    vendorId: "",
    productId: "",
    quantity: "",
    notes: "",
  })

  const [vendorForm, setVendorForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "",
  })

  const [deliveryForm, setDeliveryForm] = useState({
    orderId: "",
    deliveryDate: "",
    address: "",
    notes: "",
  })

  const [purchaseForm, setPurchaseForm] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    unitPrice: "",
    notes: "",
  })

  const [recordForm, setRecordForm] = useState({
    animalType: "",
    breed: "",
    weight: "",
    age: "",
    healthStatus: "",
    source: "",
    arrivalDate: "",
    notes: "",
  })

  const [locationForm, setLocationForm] = useState({
    name: "",
    type: "",
    address: "",
    capacity: "",
    manager: "",
    phone: "",
    coordinates: "",
  })

  const [agentOrderForm, setAgentOrderForm] = useState({
    agentId: "",
    productId: "",
    quantity: "",
    commission: "",
    deliveryDate: "",
    notes: "",
  })

  const [saleForm, setSaleForm] = useState({
    vendorId: "",
    productId: "",
    quantity: "",
    unitPrice: "",
    paymentTerms: "",
    notes: "",
  })

  const [vendorOrderForm, setVendorOrderForm] = useState({
    vendorId: "",
    products: [{ productId: "", quantity: "", unitPrice: "" }],
    deliveryDate: "",
    paymentMethod: "",
    notes: "",
  })

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [kpiData, products, inventory, orders] = await Promise.all([
          mockApi.getKPIs(),
          mockApi.getProducts(),
          mockApi.getInventory(),
          mockApi.getOrders(),
        ])

        const customerOrders = JSON.parse(localStorage.getItem("customer-orders") || "[]")
        const activeCustomerOrders = customerOrders.filter(
          (order: any) => order.status !== "Delivered" && order.status !== "Cancelled",
        ).length

        const enhancedKpis: KPIData = {
          ...(kpiData as any),
          activeOrders: orders.filter((order: any) => order.status !== "Delivered").length + activeCustomerOrders,
          fastestSellingProduct: "Premium Beef Steak",
          topSellingRegion: "Dhaka",
          monthlyGrowthRate: 18.5,
          weeklyOrderGrowth: 12.3,
          avgRearingDays: 0,
        }

        setKpis(enhancedKpis)

        const productTypes = (products as any[]).reduce((acc: any, product: any) => {
          acc[product.type] = (acc[product.type] || 0) + 1
          return acc
        }, {})

        const productDistribution = Object.entries(productTypes).map(([name, value]) => ({
          name,
          value,
        }))

        const inventoryLevels = (inventory as any[]).map((item: any) => ({
          name: String(item.productName).substring(0, 10),
          current: item.currentStock,
          min: item.minStockLevel,
          max: item.maxStockLevel,
        }))

        const regionSales = [
          { region: "Dhaka", sales: 45000, orders: 120 },
          { region: "Chittagong", sales: 32000, orders: 85 },
          { region: "Sylhet", sales: 28000, orders: 75 },
          { region: "Rajshahi", sales: 25000, orders: 68 },
          { region: "Khulna", sales: 22000, orders: 60 },
          { region: "Barisal", sales: 18000, orders: 48 },
        ]

        const productSales = [
          { product: "Beef", sales: 85000, percentage: 35 },
          { product: "Chicken", sales: 72000, percentage: 30 },
          { product: "Mutton", sales: 48000, percentage: 20 },
          { product: "Fish", sales: 36000, percentage: 15 },
        ]

        setChartData({
          productDistribution,
          inventoryLevels,
          regionSales,
          productSales,
        })
      } catch (error) {
        console.error("Error fetching KPIs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchKPIs()
  }, [])

  const validateForm = (form: any, requiredFields: string[]) => {
    for (const field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === "") {
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const handleAddProduct = async () => {
    if (!validateForm(productForm, ["name", "type", "wholesalePrice", "retailPrice", "weight", "district"])) {
      return
    }

    try {
      await mockApi.createProduct({
        ...productForm,
        wholesalePrice: Number.parseFloat(productForm.wholesalePrice),
        retailPrice: Number.parseFloat(productForm.retailPrice),
        weight: Number.parseFloat(productForm.weight),
        fcr: Number.parseFloat(productForm.fcr) || 0,
        rearingDays: Number.parseInt(productForm.rearingDays) || 0,
        status: "active",
      } as any)
      toast({
        title: "Success",
        description: "Product added successfully!",
      })
      setOpenModals({ ...openModals, addProduct: false })
      setProductForm({
        name: "",
        type: "",
        wholesalePrice: "",
        retailPrice: "",
        description: "",
        weight: "",
        fcr: "",
        rearingDays: "",
        district: "",
      })
      // Refresh KPIs
      const kpiData = await mockApi.getKPIs()
      setKpis((prev) => ({ ...(prev as KPIData), ...(kpiData as any) }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  const handleNewOrder = async () => {
    if (!validateForm(orderForm, ["vendorId", "productId", "quantity"])) {
      return
    }

    try {
      await mockApi.createOrder({
        ...orderForm,
        quantity: Number.parseInt(orderForm.quantity),
        status: "Pending",
        orderDate: new Date().toISOString(),
        totalAmount: 0,
        unitPrice: 0,
      } as any)
      toast({ title: "Success", description: "Order created successfully!" })
      setOpenModals({ ...openModals, newOrder: false })
      setOrderForm({ vendorId: "", productId: "", quantity: "", notes: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create order", variant: "destructive" })
    }
  }

  const handleAddVendor = async () => {
    if (!validateForm(vendorForm, ["name", "email", "phone", "type"])) {
      return
    }
    try {
      await mockApi.createVendor({ ...vendorForm })
      toast({ title: "Success", description: "Vendor added successfully!" })
      setOpenModals({ ...openModals, addVendor: false })
      setVendorForm({ name: "", email: "", phone: "", address: "", type: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add vendor", variant: "destructive" })
    }
  }

  const handleScheduleDelivery = async () => {
    if (!validateForm(deliveryForm, ["orderId", "deliveryDate", "address"])) {
      return
    }
    try {
      toast({ title: "Success", description: "Delivery scheduled successfully!" })
      setOpenModals({ ...openModals, scheduleDelivery: false })
      setDeliveryForm({ orderId: "", deliveryDate: "", address: "", notes: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to schedule delivery", variant: "destructive" })
    }
  }

  const handleExportReport = () => {
    const csvData = [
      ["Metric", "Value"],
      ["Total Products", String(kpis?.totalProducts || 0)],
      ["Total Vendors", String(kpis?.totalVendors || 0)],
      ["Total Orders", String(kpis?.totalOrders || 0)],
      ["Total Revenue", String(kpis?.totalRevenue || 0)],
      ["Average FCR", String(kpis?.avgFCR || 0)],
      ["Average Weight", String(kpis?.avgWeight || 0)],
      ["Average Wholesale Price", String(kpis?.avgWholesalePrice || 0)],
      ["Average Retail Price", String(kpis?.avgRetailPrice || 0)],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dashboard-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({ title: "Success", description: "Report exported successfully!" })
  }

  const handleNewPurchase = async () => {
    if (!validateForm(purchaseForm, ["supplierId", "productId", "quantity", "unitPrice"])) {
      return
    }
    try {
      toast({ title: "Success", description: "Purchase order created successfully!" })
      setOpenModals({ ...openModals, newPurchase: false })
      setPurchaseForm({ supplierId: "", productId: "", quantity: "", unitPrice: "", notes: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create purchase order", variant: "destructive" })
    }
  }

  const handleNewRecord = async () => {
    if (!validateForm(recordForm, ["animalType", "breed", "weight", "healthStatus", "source", "arrivalDate"])) {
      return
    }
    try {
      await mockApi.createLivestock({
        animalId: `ANM-${Date.now()}`,
        type: recordForm.animalType,
        breed: recordForm.breed,
        weight: Number.parseFloat(recordForm.weight),
        age: Number.parseInt(recordForm.age) || 0,
        healthStatus: recordForm.healthStatus as any,
        location: recordForm.source,
        lastVaccination: recordForm.arrivalDate,
        feedType: "Standard",
        notes: recordForm.notes,
      })
      toast({ title: "Success", description: "Animal intake record created successfully!" })
      setOpenModals({ ...openModals, newRecord: false })
      setRecordForm({
        animalType: "",
        breed: "",
        weight: "",
        age: "",
        healthStatus: "",
        source: "",
        arrivalDate: "",
        notes: "",
      })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create intake record", variant: "destructive" })
    }
  }

  const handleAddLocation = async () => {
    if (!validateForm(locationForm, ["name", "type", "address", "capacity", "manager"])) {
      return
    }
    try {
      await mockApi.createDistribution({
        routeNumber: `LOC-${Date.now()}`,
        driverName: locationForm.manager,
        vehicleId: "N/A",
        origin: locationForm.address,
        destination: locationForm.address,
        distance: 0,
        temperature: 4,
        scheduledDate: new Date().toISOString().split("T")[0],
        estimatedTime: "0 hours",
        status: "Scheduled",
        products: [],
        gpsLocation: false,
      })
      toast({ title: "Success", description: "Location added successfully!" })
      setOpenModals({ ...openModals, addLocation: false })
      setLocationForm({ name: "", type: "", address: "", capacity: "", manager: "", phone: "", coordinates: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add location", variant: "destructive" })
    }
  }

  const handleNewAgentOrder = async () => {
    if (!validateForm(agentOrderForm, ["agentId", "productId", "quantity", "commission", "deliveryDate"])) {
      return
    }
    try {
      await mockApi.createOrder({
        vendorId: agentOrderForm.agentId,
        productId: agentOrderForm.productId,
        quantity: Number.parseInt(agentOrderForm.quantity),
        status: "Pending",
        orderDate: new Date().toISOString(),
        totalAmount: Number.parseFloat(agentOrderForm.commission),
        unitPrice: 0,
        vendorName: "Agent",
        productName: "",
        deliveryDate: agentOrderForm.deliveryDate,
      } as any)
      toast({ title: "Success", description: "Agent order created successfully!" })
      setOpenModals({ ...openModals, newAgentOrder: false })
      setAgentOrderForm({ agentId: "", productId: "", quantity: "", commission: "", deliveryDate: "", notes: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create agent order", variant: "destructive" })
    }
  }

  const handleNewSale = async () => {
    if (!validateForm(saleForm, ["vendorId", "productId", "quantity", "unitPrice"])) {
      return
    }
    try {
      const totalAmount = Number.parseFloat(saleForm.unitPrice) * Number.parseInt(saleForm.quantity)
      await mockApi.createOrder({
        vendorId: saleForm.vendorId,
        productId: saleForm.productId,
        quantity: Number.parseInt(saleForm.quantity),
        status: "Delivered",
        orderDate: new Date().toISOString(),
        totalAmount,
        unitPrice: Number.parseFloat(saleForm.unitPrice),
        notes: `Sale - Payment Terms: ${saleForm.paymentTerms} - ${saleForm.notes}`,
      } as any)
      toast({ title: "Success", description: "Sale record created successfully!" })
      setOpenModals({ ...openModals, newSale: false })
      setSaleForm({ vendorId: "", productId: "", quantity: "", unitPrice: "", paymentTerms: "", notes: "" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create sale record", variant: "destructive" })
    }
  }

  const handleNewVendorOrder = async () => {
    if (!validateForm(vendorOrderForm, ["vendorId", "deliveryDate", "paymentMethod"])) {
      return
    }
    try {
      for (const product of vendorOrderForm.products) {
        if (product.productId && product.quantity && product.unitPrice) {
          const totalAmount = Number.parseFloat(product.unitPrice) * Number.parseInt(product.quantity)
          await mockApi.createOrder({
            vendorId: vendorOrderForm.vendorId,
            productId: product.productId,
            quantity: Number.parseInt(product.quantity),
            status: "Pending",
            orderDate: new Date().toISOString(),
            totalAmount,
            unitPrice: Number.parseFloat(product.unitPrice),
            notes: `Vendor Order - Payment: ${vendorOrderForm.paymentMethod} - Delivery: ${vendorOrderForm.deliveryDate} - ${vendorOrderForm.notes}`,
          } as any)
        }
      }
      toast({ title: "Success", description: "Vendor order created successfully!" })
      setOpenModals({ ...openModals, newVendorOrder: false })
      setVendorOrderForm({
        vendorId: "",
        products: [{ productId: "", quantity: "", unitPrice: "" }],
        deliveryDate: "",
        paymentMethod: "",
        notes: "",
      })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create vendor order", variant: "destructive" })
    }
  }

  const quickActions = [
    { label: "Add Product", icon: Plus, action: () => setOpenModals({ ...openModals, addProduct: true }), modal: "addProduct" },
    { label: "New Order", icon: ShoppingCart, action: () => setOpenModals({ ...openModals, newOrder: true }), modal: "newOrder" },
    { label: "Add Vendor", icon: UserPlus, action: () => setOpenModals({ ...openModals, addVendor: true }), modal: "addVendor" },
    { label: "New Record", icon: FileText, action: () => setOpenModals({ ...openModals, newRecord: true }), modal: "newRecord" },
    { label: "Add Location", icon: MapPin, action: () => setOpenModals({ ...openModals, addLocation: true }), modal: "addLocation" },
    { label: "Schedule Delivery", icon: Truck, action: () => setOpenModals({ ...openModals, scheduleDelivery: true }), modal: "scheduleDelivery" },
    { label: "New Agent Order", icon: UserCheck, action: () => setOpenModals({ ...openModals, newAgentOrder: true }), modal: "newAgentOrder" },
    { label: "Export Report", icon: FileDown, action: handleExportReport, modal: null },
    { label: "New Purchase", icon: DollarSign, action: () => setOpenModals({ ...openModals, newPurchase: true }), modal: "newPurchase" },
    { label: "New Sale", icon: Store, action: () => setOpenModals({ ...openModals, newSale: true }), modal: "newSale" },
    { label: "New Vendor Order", icon: Package, action: () => setOpenModals({ ...openModals, newVendorOrder: true }), modal: "newVendorOrder" },
  ] as const

  if (loading || !kpis) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your meat supply chain today.</p>
        </div>
        <Badge variant="secondary" className="text-sm">{user?.role}</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Products</p><p className="text-2xl font-bold">{kpis.totalProducts}</p></div><Package className="h-8 w-8"/></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Vendors</p><p className="text-2xl font-bold">{kpis.totalVendors}</p></div><Users className="h-8 w-8"/></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold">{kpis.totalOrders}</p></div><ShoppingCart className="h-8 w-8"/></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Monthly Growth</p><p className="text-2xl font-bold">{kpis.monthlyGrowthRate}%</p></div><TrendingUp className="h-8 w-8"/></div></CardContent></Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Button key={index} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-accent transition-all duration-200" onClick={action.action}>
                <action.icon className="h-5 w-5" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={openModals.addProduct} onOpenChange={(open) => setOpenModals({ ...openModals, addProduct: open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Create a new product in your inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input id="productName" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <Select value={productForm.type} onValueChange={(value) => setProductForm({ ...productForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beef">Beef</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                    <SelectItem value="mutton">Mutton</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wholesalePrice">Wholesale Price (৳) *</Label>
                <Input id="wholesalePrice" type="number" value={productForm.wholesalePrice} onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="retailPrice">Retail Price (৳) *</Label>
                <Input id="retailPrice" type="number" value={productForm.retailPrice} onChange={(e) => setProductForm({ ...productForm, retailPrice: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input id="weight" type="number" value={productForm.weight} onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })} placeholder="0.0" />
              </div>
              <div>
                <Label htmlFor="fcr">FCR</Label>
                <Input id="fcr" type="number" step="0.1" value={productForm.fcr} onChange={(e) => setProductForm({ ...productForm, fcr: e.target.value })} placeholder="0.0" />
              </div>
              <div>
                <Label htmlFor="rearingDays">Rearing Days</Label>
                <Input id="rearingDays" type="number" value={productForm.rearingDays} onChange={(e) => setProductForm({ ...productForm, rearingDays: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div>
              <Label htmlFor="district">District *</Label>
              <Select value={productForm.district} onValueChange={(value) => setProductForm({ ...productForm, district: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chittagong">Chittagong</SelectItem>
                  <SelectItem value="Sylhet">Sylhet</SelectItem>
                  <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                  <SelectItem value="Khulna">Khulna</SelectItem>
                  <SelectItem value="Barisal">Barisal</SelectItem>
                  <SelectItem value="Rangpur">Rangpur</SelectItem>
                  <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product description" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, addProduct: false })}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Record Modal */}
      <Dialog open={openModals.newRecord} onOpenChange={(open) => setOpenModals({ ...openModals, newRecord: open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Animal Intake Record</DialogTitle>
            <DialogDescription>Record new animal arrival and intake details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="animalType">Animal Type *</Label>
                <Select value={recordForm.animalType} onValueChange={(value) => setRecordForm({ ...recordForm, animalType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                    <SelectItem value="goat">Goat</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="breed">Breed *</Label>
                <Input id="breed" value={recordForm.breed} onChange={(e) => setRecordForm({ ...recordForm, breed: e.target.value })} placeholder="Enter breed" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recordWeight">Weight (kg) *</Label>
                <Input id="recordWeight" type="number" value={recordForm.weight} onChange={(e) => setRecordForm({ ...recordForm, weight: e.target.value })} placeholder="0.0" />
              </div>
              <div>
                <Label htmlFor="age">Age (months)</Label>
                <Input id="age" type="number" value={recordForm.age} onChange={(e) => setRecordForm({ ...recordForm, age: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="healthStatus">Health Status *</Label>
                <Select value={recordForm.healthStatus} onValueChange={(value) => setRecordForm({ ...recordForm, healthStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="quarantine">Quarantine</SelectItem>
                    <SelectItem value="recovering">Recovering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="source">Source *</Label>
                <Input id="source" value={recordForm.source} onChange={(e) => setRecordForm({ ...recordForm, source: e.target.value })} placeholder="Farm/Supplier name" />
              </div>
            </div>
            <div>
              <Label htmlFor="arrivalDate">Arrival Date *</Label>
              <Input id="arrivalDate" type="date" value={recordForm.arrivalDate} onChange={(e) => setRecordForm({ ...recordForm, arrivalDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="recordNotes">Notes</Label>
              <Textarea id="recordNotes" value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} placeholder="Additional notes about the animal" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, newRecord: false })}>Cancel</Button>
              <Button onClick={handleNewRecord}>Create Record</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Location Modal */}
      <Dialog open={openModals.addLocation} onOpenChange={(open) => setOpenModals({ ...openModals, addLocation: open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>Add a new warehouse, farm, or distribution center</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationName">Location Name *</Label>
                <Input id="locationName" value={locationForm.name} onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })} placeholder="Enter location name" />
              </div>
              <div>
                <Label htmlFor="locationType">Location Type *</Label>
                <Select value={locationForm.type} onValueChange={(value) => setLocationForm({ ...locationForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="farm">Farm</SelectItem>
                    <SelectItem value="distribution">Distribution Center</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="locationAddress">Address *</Label>
              <Textarea id="locationAddress" value={locationForm.address} onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })} placeholder="Full address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity *</Label>
                <Input id="capacity" value={locationForm.capacity} onChange={(e) => setLocationForm({ ...locationForm, capacity: e.target.value })} placeholder="Storage capacity" />
              </div>
              <div>
                <Label htmlFor="manager">Manager *</Label>
                <Input id="manager" value={locationForm.manager} onChange={(e) => setLocationForm({ ...locationForm, manager: e.target.value })} placeholder="Manager name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationPhone">Phone</Label>
                <Input id="locationPhone" value={locationForm.phone} onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })} placeholder="+880 1234 567890" />
              </div>
              <div>
                <Label htmlFor="coordinates">GPS Coordinates</Label>
                <Input id="coordinates" value={locationForm.coordinates} onChange={(e) => setLocationForm({ ...locationForm, coordinates: e.target.value })} placeholder="23.8103,90.4125" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, addLocation: false })}>Cancel</Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Agent Order Modal */}
      <Dialog open={openModals.newAgentOrder} onOpenChange={(open) => setOpenModals({ ...openModals, newAgentOrder: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Agent Order</DialogTitle>
            <DialogDescription>Create an order through an agent</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="agentSelect">Agent *</Label>
              <Select value={agentOrderForm.agentId} onValueChange={(value) => setAgentOrderForm({ ...agentOrderForm, agentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Agent Rahman</SelectItem>
                  <SelectItem value="2">Agent Karim</SelectItem>
                  <SelectItem value="3">Agent Hasan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agentProductSelect">Product *</Label>
              <Select value={agentOrderForm.productId} onValueChange={(value) => setAgentOrderForm({ ...agentOrderForm, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Premium Beef</SelectItem>
                  <SelectItem value="2">Fresh Chicken</SelectItem>
                  <SelectItem value="3">Organic Mutton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agentQuantity">Quantity (kg) *</Label>
                <Input id="agentQuantity" type="number" value={agentOrderForm.quantity} onChange={(e) => setAgentOrderForm({ ...agentOrderForm, quantity: e.target.value })} placeholder="Enter quantity" />
              </div>
              <div>
                <Label htmlFor="commission">Commission (%) *</Label>
                <Input id="commission" type="number" value={agentOrderForm.commission} onChange={(e) => setAgentOrderForm({ ...agentOrderForm, commission: e.target.value })} placeholder="5.0" />
              </div>
            </div>
            <div>
              <Label htmlFor="agentDeliveryDate">Delivery Date *</Label>
              <Input id="agentDeliveryDate" type="date" value={agentOrderForm.deliveryDate} onChange={(e) => setAgentOrderForm({ ...agentOrderForm, deliveryDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="agentOrderNotes">Notes</Label>
              <Textarea id="agentOrderNotes" value={agentOrderForm.notes} onChange={(e) => setAgentOrderForm({ ...agentOrderForm, notes: e.target.value })} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, newAgentOrder: false })}>Cancel</Button>
              <Button onClick={handleNewAgentOrder}>Create Agent Order</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Sale Modal */}
      <Dialog open={openModals.newSale} onOpenChange={(open) => setOpenModals({ ...openModals, newSale: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Sale to Vendor</DialogTitle>
            <DialogDescription>Record a sale transaction to a vendor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="saleVendorSelect">Vendor *</Label>
              <Select value={saleForm.vendorId} onValueChange={(value) => setSaleForm({ ...saleForm, vendorId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dhaka Suppliers</SelectItem>
                  <SelectItem value="2">Chittagong Meat Co.</SelectItem>
                  <SelectItem value="3">Sylhet Fresh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="saleProductSelect">Product *</Label>
              <Select value={saleForm.productId} onValueChange={(value) => setSaleForm({ ...saleForm, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Premium Beef</SelectItem>
                  <SelectItem value="2">Fresh Chicken</SelectItem>
                  <SelectItem value="3">Organic Mutton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="saleQuantity">Quantity (kg) *</Label>
                <Input id="saleQuantity" type="number" value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} placeholder="Enter quantity" />
              </div>
              <div>
                <Label htmlFor="saleUnitPrice">Unit Price (৳) *</Label>
                <Input id="saleUnitPrice" type="number" value={saleForm.unitPrice} onChange={(e) => setSaleForm({ ...saleForm, unitPrice: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={saleForm.paymentTerms} onValueChange={(value) => setSaleForm({ ...saleForm, paymentTerms: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit-7">7 Days Credit</SelectItem>
                  <SelectItem value="credit-15">15 Days Credit</SelectItem>
                  <SelectItem value="credit-30">30 Days Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="saleNotes">Notes</Label>
              <Textarea id="saleNotes" value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, newSale: false })}>Cancel</Button>
              <Button onClick={handleNewSale}>Create Sale</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Minimal dialogs for other actions to avoid dead buttons */}
      <Dialog open={openModals.newOrder} onOpenChange={(o) => setOpenModals({ ...openModals, newOrder: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Order</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Vendor</Label><Input value={orderForm.vendorId} onChange={(e) => setOrderForm({ ...orderForm, vendorId: e.target.value })} /></div>
            <div><Label>Product</Label><Input value={orderForm.productId} onChange={(e) => setOrderForm({ ...orderForm, productId: e.target.value })} /></div>
            <div><Label>Quantity</Label><Input type="number" value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })} /></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenModals({ ...openModals, newOrder: false })}>Cancel</Button><Button onClick={handleNewOrder}>Create</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModals.addVendor} onOpenChange={(o) => setOpenModals({ ...openModals, addVendor: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Vendor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={vendorForm.email} onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={vendorForm.phone} onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })} /></div>
            <div><Label>Type</Label><Input value={vendorForm.type} onChange={(e) => setVendorForm({ ...vendorForm, type: e.target.value })} /></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenModals({ ...openModals, addVendor: false })}>Cancel</Button><Button onClick={handleAddVendor}>Add</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModals.scheduleDelivery} onOpenChange={(o) => setOpenModals({ ...openModals, scheduleDelivery: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Delivery</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Order ID</Label><Input value={deliveryForm.orderId} onChange={(e) => setDeliveryForm({ ...deliveryForm, orderId: e.target.value })} /></div>
            <div><Label>Delivery Date</Label><Input type="date" value={deliveryForm.deliveryDate} onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryDate: e.target.value })} /></div>
            <div><Label>Address</Label><Textarea value={deliveryForm.address} onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })} /></div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenModals({ ...openModals, scheduleDelivery: false })}>Cancel</Button><Button onClick={handleScheduleDelivery}>Schedule</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModals.newPurchase} onOpenChange={(o) => setOpenModals({ ...openModals, newPurchase: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Purchase</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Supplier</Label><Input value={purchaseForm.supplierId} onChange={(e) => setPurchaseForm({ ...purchaseForm, supplierId: e.target.value })} /></div>
            <div><Label>Product</Label><Input value={purchaseForm.productId} onChange={(e) => setPurchaseForm({ ...purchaseForm, productId: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quantity</Label><Input type="number" value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })} /></div>
              <div><Label>Unit Price</Label><Input type="number" value={purchaseForm.unitPrice} onChange={(e) => setPurchaseForm({ ...purchaseForm, unitPrice: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenModals({ ...openModals, newPurchase: false })}>Cancel</Button><Button onClick={handleNewPurchase}>Create</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModals.newVendorOrder} onOpenChange={(o) => setOpenModals({ ...openModals, newVendorOrder: o })}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Vendor Order</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Vendor</Label><Input value={vendorOrderForm.vendorId} onChange={(e) => setVendorOrderForm({ ...vendorOrderForm, vendorId: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Product ID" value={vendorOrderForm.products[0].productId} onChange={(e) => setVendorOrderForm({ ...vendorOrderForm, products: [{ ...vendorOrderForm.products[0], productId: e.target.value }] })} />
              <Input placeholder="Qty" type="number" value={vendorOrderForm.products[0].quantity} onChange={(e) => setVendorOrderForm({ ...vendorOrderForm, products: [{ ...vendorOrderForm.products[0], quantity: e.target.value }] })} />
              <Input placeholder="Unit Price" type="number" value={vendorOrderForm.products[0].unitPrice} onChange={(e) => setVendorOrderForm({ ...vendorOrderForm, products: [{ ...vendorOrderForm.products[0], unitPrice: e.target.value }] })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Delivery</Label><Input type="date" value={vendorOrderForm.deliveryDate} onChange={(e) => setVendorOrderForm({ ...vendorOrderForm, deliveryDate: e.target.value })} /></div>
              <div><Label>Payment</Label><Input value={vendorOrderForm.paymentMethod} onChange={(e) => setVendorOrderForm({ ...vendorOrderForm, paymentMethod: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpenModals({ ...openModals, newVendorOrder: false })}>Cancel</Button><Button onClick={handleNewVendorOrder}>Create</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
