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
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Plus,
  FileDown,
  UserPlus,
  Truck,
  MapPin,
  FileText,
  UserCheck,
  Store,
  Brain,
  BarChart3,
} from "lucide-react"
import { mockApi } from "@/services/mock-api"
import { useAuth } from "@/hooks/use-auth"
import {
  ProductionVsDemandChart,
  PriceHistoryChart,
  ProductDistributionChart,
  InventoryLevelsChart,
} from "@/components/charts/dashboard-charts"
import { AIRecommendationsPanel } from "@/components/ai/ai-recommendations-panel"

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

        const enhancedKpis = {
          ...kpiData,
          activeOrders: orders.filter((order: any) => order.status !== "Delivered").length + activeCustomerOrders,
          fastestSellingProduct: "Premium Beef Steak",
          topSellingRegion: "Dhaka",
          monthlyGrowthRate: 18.5,
          weeklyOrderGrowth: 12.3,
        }

        setKpis(enhancedKpis)

        const productTypes = products.reduce((acc: any, product) => {
          acc[product.type] = (acc[product.type] || 0) + 1
          return acc
        }, {})

        const productDistribution = Object.entries(productTypes).map(([name, value]) => ({
          name,
          value,
        }))

        const inventoryLevels = inventory.map((item) => ({
          name: item.productName.substring(0, 10),
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
      })
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
      const kpiData = await mockApi.getKPIs()
      setKpis(kpiData)
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
        vendorId: orderForm.vendorId,
        productId: orderForm.productId,
        quantity: Number.parseInt(orderForm.quantity),
        status: "Pending",
        orderDate: new Date().toISOString(),
        totalAmount: 0,
        unitPrice: 0,
      })
      toast({
        title: "Success",
        description: "Order created successfully!",
      })
      setOpenModals({ ...openModals, newOrder: false })
      setOrderForm({ vendorId: "", productId: "", quantity: "", notes: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    }
  }

  const handleAddVendor = async () => {
    if (!validateForm(vendorForm, ["name", "email", "phone", "type"])) {
      return
    }

    try {
      await mockApi.createVendor({
        name: vendorForm.name,
        email: vendorForm.email,
        phone: vendorForm.phone,
        address: vendorForm.address,
        type: vendorForm.type,
        status: "active",
        createdAt: new Date().toISOString(),
      })
      toast({
        title: "Success",
        description: "Vendor added successfully!",
      })
      setOpenModals({ ...openModals, addVendor: false })
      setVendorForm({ name: "", email: "", phone: "", address: "", type: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vendor",
        variant: "destructive",
      })
    }
  }

  const handleExportReport = () => {
    const csvData = [
      ["Metric", "Value"],
      ["Total Products", kpis?.totalProducts || 0],
      ["Total Vendors", kpis?.totalVendors || 0],
      ["Total Orders", kpis?.totalOrders || 0],
      ["Total Revenue", kpis?.totalRevenue || 0],
      ["Average FCR", kpis?.avgFCR || 0],
      ["Average Weight", kpis?.avgWeight || 0],
      ["Average Wholesale Price", kpis?.avgWholesalePrice || 0],
      ["Average Retail Price", kpis?.avgRetailPrice || 0],
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `dashboard-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Report exported successfully!",
    })
  }

  const quickActions = [
    {
      label: "Add Product",
      icon: Plus,
      action: () => setOpenModals({ ...openModals, addProduct: true }),
      modal: "addProduct",
    },
    {
      label: "New Order",
      icon: ShoppingCart,
      action: () => setOpenModals({ ...openModals, newOrder: true }),
      modal: "newOrder",
    },
    {
      label: "Add Vendor",
      icon: UserPlus,
      action: () => setOpenModals({ ...openModals, addVendor: true }),
      modal: "addVendor",
    },
    {
      label: "Export Report",
      icon: FileDown,
      action: handleExportReport,
      modal: null,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your meat supply chain today.</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {user?.role || "User"}
        </Badge>
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
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent hover:bg-accent transition-all duration-200"
                onClick={action.action}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.activeOrders || 0}</div>
            <p className="text-xs text-white/80">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{kpis?.weeklyOrderGrowth || 0}% this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-green-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{kpis?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-white/80">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{kpis?.monthlyGrowthRate || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Products</CardTitle>
            <Package className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.totalProducts || 0}</div>
            <p className="text-xs text-white/80">
              <TrendingUp className="inline h-3 w-3 mr-1" />+12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.totalVendors || 0}</div>
            <p className="text-xs text-white/80">
              <TrendingUp className="inline h-3 w-3 mr-1" />+5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ProductionVsDemandChart />
        <ProductDistributionChart data={chartData.productDistribution} />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <PriceHistoryChart />
        <InventoryLevelsChart data={chartData.inventoryLevels} />
      </div>

      {/* AI Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Get intelligent recommendations to optimize your meat supply chain operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIRecommendationsPanel />
        </CardContent>
      </Card>

      {/* Modals */}
      <Dialog open={openModals.addProduct} onOpenChange={(open) => setOpenModals({ ...openModals, addProduct: open })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Create a new product in your inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="productType">Product Type *</Label>
                <Select
                  value={productForm.type}
                  onValueChange={(value) => setProductForm({ ...productForm, type: value })}
                >
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
                <Input
                  id="wholesalePrice"
                  type="number"
                  value={productForm.wholesalePrice}
                  onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="retailPrice">Retail Price (৳) *</Label>
                <Input
                  id="retailPrice"
                  type="number"
                  value={productForm.retailPrice}
                  onChange={(e) => setProductForm({ ...productForm, retailPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={productForm.weight}
                onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="district">District *</Label>
              <Select
                value={productForm.district}
                onValueChange={(value) => setProductForm({ ...productForm, district: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chittagong">Chittagong</SelectItem>
                  <SelectItem value="Sylhet">Sylhet</SelectItem>
                  <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, addProduct: false })}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModals.newOrder} onOpenChange={(open) => setOpenModals({ ...openModals, newOrder: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Place a new order with a vendor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendorSelect">Vendor *</Label>
              <Select
                value={orderForm.vendorId}
                onValueChange={(value) => setOrderForm({ ...orderForm, vendorId: value })}
              >
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
              <Label htmlFor="productSelect">Product *</Label>
              <Select
                value={orderForm.productId}
                onValueChange={(value) => setOrderForm({ ...orderForm, productId: value })}
              >
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
            <div>
              <Label htmlFor="quantity">Quantity (kg) *</Label>
              <Input
                id="quantity"
                type="number"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, newOrder: false })}>
                Cancel
              </Button>
              <Button onClick={handleNewOrder}>Create Order</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModals.addVendor} onOpenChange={(open) => setOpenModals({ ...openModals, addVendor: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
            <DialogDescription>Register a new vendor in your system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={vendorForm.name}
                onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                placeholder="Enter vendor name"
              />
            </div>
            <div>
              <Label htmlFor="vendorEmail">Email *</Label>
              <Input
                id="vendorEmail"
                type="email"
                value={vendorForm.email}
                onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                placeholder="vendor@example.com"
              />
            </div>
            <div>
              <Label htmlFor="vendorPhone">Phone *</Label>
              <Input
                id="vendorPhone"
                value={vendorForm.phone}
                onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                placeholder="+880 1234 567890"
              />
            </div>
            <div>
              <Label htmlFor="vendorType">Vendor Type *</Label>
              <Select value={vendorForm.type} onValueChange={(value) => setVendorForm({ ...vendorForm, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="retailer">Retailer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModals({ ...openModals, addVendor: false })}>
                Cancel
              </Button>
              <Button onClick={handleAddVendor}>Add Vendor</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
