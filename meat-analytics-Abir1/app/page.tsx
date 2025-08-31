"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCart } from "../hooks/use-cart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts"
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  Users,
  Database,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  Sun,
  Moon,
  CreditCard,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Package2,
  Users2,
  Beef,
  Scale,
  Warehouse,
  Route,
  FileText,
  Target,
  Shield,
  CheckCircle,
  Zap,
  Brain,
} from "lucide-react"
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, Facebook } from "lucide-react"

import OrdersContent from "./orders/OrdersContent"
import { ShopContent } from "./shop/ShopContent"
import { DistributionContent } from "@/app/distribution/distribution-content"

const mockData = {
  products: [
    {
      id: 1,
      name: "Premium Beef Steak",
      price: 25.99,
      stock: 50,
      category: "Beef",
      weight: "1 lb",
      description: "Grade A premium beef steak",
      image: "/juicy-beef-steak.png",
    },
    {
      id: 2,
      name: "Organic Chicken",
      price: 12.99,
      stock: 75,
      category: "Chicken",
      weight: "2 lbs",
      description: "Free-range organic chicken",
      image: "/grilled-chicken-bangla.png",
    },
    {
      id: 3,
      name: "Lamb Chops",
      price: 32.99,
      stock: 30,
      category: "Lamb",
      weight: "1.5 lbs",
      description: "Fresh lamb chops",
      image: "/grilled-lamb-chops.png",
    },
    {
      id: 4,
      name: "Pork Tenderloin",
      price: 18.99,
      stock: 40,
      category: "Pork",
      weight: "2 lbs",
      description: "Tender pork tenderloin",
      image: "/grilled-pork-tenderloin.png",
    },
    {
      id: 5,
      name: "Bangla Meat",
      price: 15.99,
      stock: 25,
      category: "Turkey",
      weight: "3 lbs",
      description: "Fresh bangla meat",
      image: "/turkey-bangla.png",
    },
  ],
  vendors: [
    {
      id: 1,
      name: "Premium Meat Co.",
      contact: "John Smith",
      phone: "+1-555-0123",
      email: "john@premiummeat.com",
      location: "Texas",
      rating: 4.8,
      orders: 156,
      status: "Active",
    },
    {
      id: 2,
      name: "Farm Fresh Suppliers",
      contact: "Sarah Johnson",
      phone: "+1-555-0124",
      email: "sarah@farmfresh.com",
      location: "Nebraska",
      rating: 4.6,
      orders: 89,
      status: "Active",
    },
  ],
  orders: [
    {
      id: 1001,
      customer: "Restaurant ABC",
      items: "Beef Steak x5, Chicken  x10",
      total: 259.85,
      status: "Delivered",
      date: "2024-01-15",
      progress: 100,
      deliveryTime: "2 hours",
    },
    {
      id: 1002,
      customer: "Hotel XYZ",
      items: "Lamb Chops x8, Pork Tenderloin x6",
      total: 377.86,
      status: "In Transit",
      date: "2024-01-16",
      progress: 75,
      deliveryTime: "1 hour",
    },
  ],
  livestock: [
    {
      id: 1,
      type: "Cattle",
      breed: "Angus",
      age: 24,
      weight: 1200,
      location: "Farm A",
      status: "Healthy",
      arrivalDate: "2024-01-10",
      feedType: "Grain",
    },
    {
      id: 2,
      type: "Pig",
      breed: "Yorkshire",
      age: 8,
      weight: 250,
      location: "Farm B",
      status: "Healthy",
      arrivalDate: "2024-01-12",
      feedType: "Mixed",
    },
  ],
  nutrition: [
    {
      id: 1,
      animalId: 1,
      feedType: "Premium Grain",
      quantity: 25,
      date: "2024-01-16",
      cost: 45.5,
      supplier: "Feed Co.",
      nutritionValue: "High Protein",
    },
  ],
  warehouse: [
    {
      id: 1,
      item: "Beef Cuts",
      quantity: 500,
      category: "Fresh Meat",
      location: "Cold Storage A",
      temperature: "-2°C",
      expiryDate: "2024-02-15",
      supplier: "Premium Meat Co.",
    },
  ],
  slaughterRecords: [
    {
      id: 1,
      animalId: 1,
      type: "Cattle",
      weight: 1200,
      processedWeight: 720,
      date: "2024-01-15",
      inspector: "Dr. Smith",
      grade: "A",
      yield: "60%",
    },
  ],
  routes: [
    {
      id: 1,
      name: "Route A - Downtown",
      driver: "Mike Johnson",
      vehicle: "Truck-001",
      stops: 5,
      distance: "45 km",
      estimatedTime: "3 hours",
      status: "Active",
    },
  ],
  agentOrders: [
    {
      id: 1,
      agent: "Agent Smith",
      products: "Beef x10, Chicken x20",
      total: 450.0,
      commission: 45.0,
      status: "Processing",
      date: "2024-01-16",
    },
  ],
  purchases: [
    {
      id: 1,
      supplier: "Farm Fresh Co.",
      items: "Live Cattle x5",
      cost: 2500.0,
      date: "2024-01-14",
      paymentStatus: "Paid",
      deliveryDate: "2024-01-16",
    },
  ],
  scaleRecords: [
    {
      id: 1,
      productType: "Beef Cuts",
      weight: 150.5,
      date: "2024-01-16",
      operator: "John Doe",
      batchNumber: "B001",
      quality: "Grade A",
    },
  ],
  vendorOrders: [
    {
      id: 1,
      vendor: "Restaurant Chain ABC",
      products: "Mixed Meat Package",
      quantity: 100,
      total: 1250.0,
      status: "Confirmed",
      deliveryDate: "2024-01-18",
    },
  ],
  analytics: {
    productionTrends: [
      { month: "Jan", beef: 1200, chicken: 800, pork: 600, lamb: 400 },
      { month: "Feb", beef: 1400, chicken: 900, pork: 700, lamb: 450 },
      { month: "Mar", beef: 1300, chicken: 850, pork: 650, lamb: 420 },
    ],
    marketPrices: [
      { product: "Beef", price: 25.99, change: 2.5 },
      { product: "Chicken", price: 12.99, change: -1.2 },
      { product: "Pork", price: 18.99, change: 0.8 },
      { product: "Lamb", price: 32.99, change: 3.2 },
    ],
    demandSupply: [
      { category: "Beef", demand: 85, supply: 78 },
      { category: "Chicken", demand: 92, supply: 95 },
      { category: "Pork", demand: 76, supply: 82 },
      { category: "Lamb", demand: 68, supply: 65 },
    ],
  },
}

export default function MeatAnalyticsDashboard() {
const router = useRouter()
const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice } = useCart()
const cartTotal = getTotalPrice()
const [sidebarOpen, setSidebarOpen] = useState(false)
const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
const [activeView, setActiveView] = useState("dashboard")
const [currentModule, setCurrentModule] = useState("products")
const [searchTerm, setSearchTerm] = useState("")
const [filterValue, setFilterValue] = useState("all")
const { theme, setTheme } = useTheme()
const { toast } = useToast()

// Authentication state
const { login, register, logout } = useAuth()
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [showLoginForm, setShowLoginForm] = useState(false)
const [loginData, setLoginData] = useState({ email: "", password: "" })
const [registerData, setRegisterData] = useState({ email: "", password: "", name: "", role: "Retailer" })
const [showRegisterForm, setShowRegisterForm] = useState(false)

// UI states
const [loading, setLoading] = useState(false)
const [showAddForm, setShowAddForm] = useState(false)
const [showEditForm, setShowEditForm] = useState(false)
const [showDeleteDialog, setShowDeleteDialog] = useState(false)
const [selectedItem, setSelectedItem] = useState(null)
const [formData, setFormData] = useState({})
const [mounted, setMounted] = useState(false)

// Real-time data states
const [weatherData, setWeatherData] = useState({ temp: 28, condition: "Sunny", icon: "☀️"})
const [currentTime, setCurrentTime] = useState<Date | null>(null)

// Data states with localStorage persistence
const [products, setProducts] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("meatanalytics_products")
    return saved ? JSON.parse(saved) : mockData.products
  }
  return mockData.products
})

  const [vendors, setVendors] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_vendors")
      return saved ? JSON.parse(saved) : mockData.vendors
    }
    return mockData.vendors
  })

  const [orders, setOrders] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_orders")
      return saved ? JSON.parse(saved) : mockData.orders
    }
    return mockData.orders
  })

  const [livestock, setLivestock] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_livestock")
      return saved ? JSON.parse(saved) : mockData.livestock
    }
    return mockData.livestock
  })

  const [nutrition, setNutrition] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_nutrition")
      return saved ? JSON.parse(saved) : mockData.nutrition
    }
    return mockData.nutrition
  })

  const [warehouse, setWarehouse] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_warehouse")
      return saved ? JSON.parse(saved) : mockData.warehouse
    }
    return mockData.warehouse
  })

  const [slaughterRecords, setSlaughterRecords] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_slaughter")
      return saved ? JSON.parse(saved) : mockData.slaughterRecords
    }
    return mockData.slaughterRecords
  })

  const [routes, setRoutes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_routes")
      return saved ? JSON.parse(saved) : mockData.routes
    }
    return mockData.routes
  })

  const [agentOrders, setAgentOrders] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_agentorders")
      return saved ? JSON.parse(saved) : mockData.agentOrders
    }
    return mockData.agentOrders
  })

  const [purchases, setPurchases] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_purchases")
      return saved ? JSON.parse(saved) : mockData.purchases
    }
    return mockData.purchases
  })

  const [scaleRecords, setScaleRecords] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_scale")
      return saved ? JSON.parse(saved) : mockData.scaleRecords
    }
    return mockData.scaleRecords
  })

  const [vendorOrders, setVendorOrders] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meatanalytics_vendororders")
      return saved ? JSON.parse(saved) : mockData.vendorOrders
    }
    return mockData.vendorOrders
  })

  const [analytics, setAnalytics] = useState(mockData.analytics)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("meatanalytics_products", JSON.stringify(products))
      localStorage.setItem("meatanalytics_vendors", JSON.stringify(vendors))
      localStorage.setItem("meatanalytics_orders", JSON.stringify(orders))
      localStorage.setItem("meatanalytics_livestock", JSON.stringify(livestock))
      localStorage.setItem("meatanalytics_nutrition", JSON.stringify(nutrition))
      localStorage.setItem("meatanalytics_warehouse", JSON.stringify(warehouse))
      localStorage.setItem("meatanalytics_slaughter", JSON.stringify(slaughterRecords))
      localStorage.setItem("meatanalytics_routes", JSON.stringify(routes))
      localStorage.setItem("meatanalytics_agentorders", JSON.stringify(agentOrders))
      localStorage.setItem("meatanalytics_purchases", JSON.stringify(purchases))
      localStorage.setItem("meatanalytics_scale", JSON.stringify(scaleRecords))
      localStorage.setItem("meatanalytics_vendororders", JSON.stringify(vendorOrders))
    }
  }, [
    products,
    vendors,
    orders,
    livestock,
    nutrition,
    warehouse,
    slaughterRecords,
    routes,
    agentOrders,
    purchases,
    scaleRecords,
    vendorOrders,
  ])

  useEffect(() => {
    // Initialize time on client side only
    setCurrentTime(new Date())
    setLastUpdated(new Date())
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAdd = async (module, data) => {
    setLoading(true)
    try {
      const newId = Date.now()
      const timestamp = new Date().toISOString().split("T")[0]
      const newItem = {
        ...data,
        id: newId,
        date: timestamp,
        status: data.status || "Active",
      }

      switch (module) {
        case "products":
          setProducts((prev) => [...prev, newItem])
          break
        case "vendors":
          setVendors((prev) => [...prev, { ...newItem, rating: 4.0, orders: 0 }])
          break
        case "orders":
          setOrders((prev) => [...prev, { ...newItem, progress: 0 }])
          break
        case "livestock":
          setLivestock((prev) => [...prev, { ...newItem, arrivalDate: timestamp }])
          break
        case "nutrition":
          setNutrition((prev) => [...prev, newItem])
          break
        case "warehouse":
          setWarehouse((prev) => [...prev, newItem])
          break
        case "slaughter":
          setSlaughterRecords((prev) => [...prev, newItem])
          break
        case "routes":
          setRoutes((prev) => [...prev, newItem])
          break
        case "agentorders":
          setAgentOrders((prev) => [...prev, newItem])
          break
        case "purchases":
          setPurchases((prev) => [...prev, { ...newItem, paymentStatus: "Pending" }])
          break
        case "scale":
          setScaleRecords((prev) => [...prev, newItem])
          break
        case "vendororders":
          setVendorOrders((prev) => [...prev, newItem])
          break
      }

      toast({
        title: "Success",
        description: `${module.charAt(0).toUpperCase() + module.slice(1)} added successfully`,
      })
      setShowAddForm(false)
      setFormData({})
      setLastUpdated(new Date())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (module, id, data) => {
    setLoading(true)
    try {
      const updateItem = (prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item))

      switch (module) {
        case "products":
          setProducts(updateItem)
          break
        case "vendors":
          setVendors(updateItem)
          break
        case "orders":
          setOrders(updateItem)
          break
        case "livestock":
          setLivestock(updateItem)
          break
        case "nutrition":
          setNutrition(updateItem)
          break
        case "warehouse":
          setWarehouse(updateItem)
          break
        case "slaughter":
          setSlaughterRecords(updateItem)
          break
        case "routes":
          setRoutes(updateItem)
          break
        case "agentorders":
          setAgentOrders(updateItem)
          break
        case "purchases":
          setPurchases(updateItem)
          break
        case "scale":
          setScaleRecords(updateItem)
          break
        case "vendororders":
          setVendorOrders(updateItem)
          break
      }

      toast({
        title: "Success",
        description: `${module.charAt(0).toUpperCase() + module.slice(1)} updated successfully`,
      })
      setShowEditForm(false)
      setSelectedItem(null)
      setFormData({})
      setLastUpdated(new Date())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (module, id) => {
    setLoading(true)
    try {
      const filterItem = (prev) => prev.filter((item) => item.id !== id)

      switch (module) {
        case "products":
          setProducts(filterItem)
          break
        case "vendors":
          setVendors(filterItem)
          break
        case "orders":
          setOrders(filterItem)
          break
        case "livestock":
          setLivestock(filterItem)
          break
        case "nutrition":
          setNutrition(filterItem)
          break
        case "warehouse":
          setWarehouse(filterItem)
          break
        case "slaughter":
          setSlaughterRecords(filterItem)
          break
        case "routes":
          setRoutes(filterItem)
          break
        case "agentorders":
          setAgentOrders(filterItem)
          break
        case "purchases":
          setPurchases(filterItem)
          break
        case "scale":
          setScaleRecords(filterItem)
          break
        case "vendororders":
          setVendorOrders(filterItem)
          break
      }

      toast({
        title: "Success",
        description: `${module.charAt(0).toUpperCase() + module.slice(1)} deleted successfully`,
      })
      setShowDeleteDialog(false)
      setSelectedItem(null)
      setLastUpdated(new Date())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    })
    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    })
  }

  const handleRemoveFromCart = (id) => {
    removeFromCart(id)
    toast({
      title: "Removed from Cart",
      description: "Item removed from cart",
    })
  }

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return
    updateQuantity(id, quantity)
  }

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data to export",
        variant: "destructive",
      })
      return
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: `${filename} exported successfully`,
    })
  }

  const openAddForm = (module) => {
    setCurrentModule(module)
    setFormData({})
    setShowAddForm(true)
  }

  const openEditForm = (module, item) => {
    setCurrentModule(module)
    setSelectedItem(item)
    setFormData(item)
    setShowEditForm(true)
  }

  const openDeleteDialog = (module, item) => {
    setCurrentModule(module)
    setSelectedItem(item)
    setShowDeleteDialog(true)
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "shop", label: "Shop", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "My Orders", icon: FileText },
    { id: "nutrition", label: "Nutrition", icon: Activity },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "livestock", label: "Livestock", icon: Beef },
    { id: "slaughter", label: "Slaughter Records", icon: Scale },
    { id: "warehouse", label: "Warehouse", icon: Warehouse },
    { id: "routes", label: "Distribution", icon: Route },
    { id: "agentorders", label: "Agent Orders", icon: Users2 },
    { id: "purchases", label: "Purchases", icon: DollarSign },
    { id: "scale", label: "Scale Records", icon: Scale },
    { id: "vendororders", label: "Vendor Orders", icon: Package2 },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "about", label: "About", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const dashboardStats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalLivestock: livestock.length,
    activeVendors: vendors.filter((v) => v.status === "Active").length,
    pendingOrders: orders.filter((o) => o.status !== "Delivered").length,
    warehouseItems: warehouse.length,
    recentActivity: [
      ...orders
        .slice(0, 3)
        .map((o) => ({ type: "Order", description: `Order #${o.id} - ${o.customer}`, time: o.date })),
      ...livestock
        .slice(0, 2)
        .map((l) => ({ type: "Livestock", description: `${l.type} added - ${l.breed}`, time: l.arrivalDate })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5),
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header with real-time info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MeatrixAnalytics Dashboard</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Loading...'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            {mounted && currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>{weatherData.icon}</span>
            {weatherData.temp}°C {weatherData.condition}
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              await logout()
              toast({ title: "Signed out", description: "You have been signed out." })
              router.push("/login")
            }}
          >
            Sign out
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-emerald-600">{dashboardStats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalOrders}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${Number(dashboardStats?.totalRevenue ?? 0).toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Livestock</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardStats.totalLivestock}</p>
              </div>
              <Beef className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.productionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="beef" stackId="1" stroke="#ef4444" fill="#ef4444" />
                <Area type="monotone" dataKey="chicken" stackId="1" stroke="#f97316" fill="#f97316" />
                <Area type="monotone" dataKey="pork" stackId="1" stroke="#eab308" fill="#eab308" />
                <Area type="monotone" dataKey="lamb" stackId="1" stroke="#22c55e" fill="#22c55e" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.marketPrices.map((item) => (
                <div key={item.product} className="flex items-center justify-between">
                  <span className="font-medium">{item.product}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${item.price}</span>
                    <span
                      className={`flex items-center text-sm ${item.change > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <Badge variant="outline">{activity.type}</Badge>
                <span className="flex-1">{activity.description}</span>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderShop = () => (
    <div className="space-y-6">
      <ShopContent />
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("products")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(products, "products")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Beef">Beef</SelectItem>
                <SelectItem value="Chicken">Chicken</SelectItem>
                <SelectItem value="Lamb">Lamb</SelectItem>
                <SelectItem value="Pork">Pork</SelectItem>
                <SelectItem value="Turkey">Turkey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                .filter((product) => {
                  const name = (product?.name ?? "").toLowerCase()
                  const q = (searchTerm ?? "").toLowerCase()
                  const category = product?.category ?? ""
                  const matchesSearch = name.includes(q)
                  const matchesFilter = filterValue === "all" || category === filterValue
                  return matchesSearch && matchesFilter
                })
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.weight}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditForm("products", product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("products", product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <OrdersContent />
    </div>
  )

  const renderLivestock = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Livestock Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("livestock")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Livestock
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(livestock, "livestock")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age (months)</TableHead>
                <TableHead>Weight (lbs)</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livestock.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.id}</TableCell>
                  <TableCell>{animal.type}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.age}</TableCell>
                  <TableCell>{animal.weight}</TableCell>
                  <TableCell>{animal.location}</TableCell>
                  <TableCell>
                    <Badge variant={animal.status === "Healthy" ? "default" : "destructive"}>{animal.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("livestock", animal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("livestock", animal)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderNutrition = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Animal Nutrition & Intake</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("nutrition")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Intake
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(nutrition, "nutrition")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal ID</TableHead>
                <TableHead>Feed Type</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutrition.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.animalId}</TableCell>
                  <TableCell>{record.feedType}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>${record.cost}</TableCell>
                  <TableCell>{record.supplier}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("nutrition", record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("nutrition", record)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderVendors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("vendors")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(vendors, "vendors")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contact}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.location}</TableCell>
                  <TableCell>{vendor.rating}/5</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>{vendor.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("vendors", vendor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("vendors", vendor)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderSlaughter = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Slaughter Records</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("slaughter")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Slaughter Record
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(slaughterRecords, "slaughter_records")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Live Weight</TableHead>
                <TableHead>Processed Weight</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slaughterRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.animalId}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.weight} lbs</TableCell>
                  <TableCell>{record.processedWeight} lbs</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.inspector}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.grade}</Badge>
                  </TableCell>
                  <TableCell>{record.yield}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("slaughter", record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("slaughter", record)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderWarehouse = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Warehouse Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("warehouse")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock Item
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(warehouse, "warehouse_inventory")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouse.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.temperature}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("warehouse", item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("warehouse", item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderRoutes = () => (
    <div className="space-y-6">
      <DistributionContent />
    </div>
  )

  const renderAgentOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Orders Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("agentorders")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Agent Order
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(agentOrders, "agent_orders")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.agent}</TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell>${Number(order?.total ?? 0).toFixed(2)}</TableCell>
                  <TableCell>${Number(order?.commission ?? 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("agentorders", order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("agentorders", order)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderPurchases = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meat Purchases</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("purchases")}>
            <Plus className="h-4 w-4 mr-2" />
            Record Purchase
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(purchases, "meat_purchases")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purchase ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">#{purchase.id}</TableCell>
                  <TableCell>{purchase.supplier}</TableCell>
                  <TableCell>{purchase.items}</TableCell>
                  <TableCell>${Number(purchase?.cost ?? 0).toFixed(2)}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>
                    <Badge variant={purchase?.paymentStatus === "Paid" ? "default" : "secondary"}>
                      {purchase?.paymentStatus ?? ""}
                    </Badge>
                  </TableCell>
                  <TableCell>{purchase.deliveryDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("purchases", purchase)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("purchases", purchase)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderScale = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scale Records</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("scale")}>
            <Plus className="h-4 w-4 mr-2" />
            Record Scale
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(scaleRecords, "scale_records")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Product Type</TableHead>
                <TableHead>Weight (lbs)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scaleRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">#{record.id}</TableCell>
                  <TableCell>{record.productType}</TableCell>
                  <TableCell>{record.weight}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.operator}</TableCell>
                  <TableCell>{record.batchNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.quality}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("scale", record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("scale", record)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderVendorOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendor Orders</h2>
        <div className="flex gap-2">
          <Button onClick={() => openAddForm("vendororders")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Vendor Order
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(vendorOrders, "vendor_orders")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${Number(order?.total ?? 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditForm("vendororders", order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog("vendororders", order)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.productionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="beef" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="chicken" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="pork" stroke="#eab308" strokeWidth={2} />
                <Line type="monotone" dataKey="lamb" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demand vs Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.demandSupply}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#3b82f6" name="Demand" />
                <Bar dataKey="supply" fill="#10b981" name="Supply" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.marketPrices.map((item) => (
                <div key={item.product} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{item.product}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">${item.price}</span>
                    <span
                      className={`flex items-center text-sm ${item.change > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Production Efficiency</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Beef production increased by 15% this quarter, showing strong market demand.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Supply Chain</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Chicken supply exceeds demand by 3%, indicating optimal inventory levels.
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Market Opportunity</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Lamb demand exceeds supply by 5%, suggesting potential for expansion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto-refresh Dashboard</Label>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                // Clear all localStorage data
                if (typeof window !== "undefined") {
                  Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith("meatanalytics_")) {
                      localStorage.removeItem(key)
                    }
                  })
                }
                // Reset all state to mock data
                setProducts(mockData.products)
                setVendors(mockData.vendors)
                setOrders(mockData.orders)
                setLivestock(mockData.livestock)
                setNutrition(mockData.nutrition)
                setWarehouse(mockData.warehouse)
                setSlaughterRecords(mockData.slaughterRecords)
                setRoutes(mockData.routes)
                setAgentOrders(mockData.agentOrders)
                setPurchases(mockData.purchases)
                setScaleRecords(mockData.scaleRecords)
                setVendorOrders(mockData.vendorOrders)

                toast({
                  title: "Data Reset Complete",
                  description: "All data has been reset to default values",
                })
              }}
            >
              Reset All Data
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Export All Data
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Import Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAbout = () => {
    const teamMembers = [
      { name: "Munim", role: "Data Specialist", icon: Database },
      { name: "Saif", role: "Production Analysis", icon: BarChart3 },
      { name: "Fahim", role: "Price Intelligence", icon: TrendingUp },
      { name: "Shihab", role: "Consumer Insights", icon: Users },
      { name: "Abir", role: "Economic Analysis", icon: Target },
      { name: "Faysal", role: "Supply & Demand", icon: Activity },
      { name: "Tanjum", role: "Strategic Planning", icon: Brain },
    ]

    const dataSources = [
      "Bangladesh Bureau of Statistics",
      "Department of Livestock Services",
      "Trading Corporation of Bangladesh",
      "Field Surveys & Market Research",
      "Satellite Monitoring Systems",
      "IoT Sensor Networks",
      "Blockchain-based Supply Chain Systems",
    ]

    const coreValues = [
      { title: "Advanced Analytics", icon: BarChart3 },
      { title: "Real-time Data", icon: Clock },
      { title: "Policy Insights", icon: Shield },
      { title: "Market Intelligence", icon: Brain },
    ]

    return (
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">About MeatAnalytics Pro</h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">System Status: Operational</span>
          </div>
        </div>

        {/* Platform Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-primary" />
              <span>Empowering Bangladesh's Meat Industry</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              MeatAnalytics Pro delivers AI-powered, data-driven insights to support sustainable growth, transparency,
              and strategic planning in the meat supply chain across Bangladesh.
            </p>
          </CardContent>
        </Card>

        {/* Research Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Research Team</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {teamMembers.map((member, index) => {
                const IconComponent = member.icon
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span>Technical Specifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">96%</div>
                <div className="text-sm text-muted-foreground">Data Accuracy</div>
                <Progress value={96} className="h-2" />
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">15min</div>
                <div className="text-sm text-muted-foreground">Update Frequency</div>
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Real-time</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">492</div>
                <div className="text-sm text-muted-foreground">Coverage</div>
                <div className="text-xs text-muted-foreground">8 Divisions, 64 Districts, 492 Upazilas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <span>Data Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataSources.map((source, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border bg-card/50">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{source}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span>Core Values & Highlights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {coreValues.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={index}
                    className="text-center space-y-2 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {value.title}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            © 2025 Meat Products Analysis Team – Independent University, Bangladesh
          </p>
        </div>
      </div>
    )
  }

  const renderContact = () => {
    const teamMembers = [
      {
        name: "Munim Rahman",
        role: "Lead Data Scientist & Project Manager",
        education: "PhD in Agricultural Economics, University of California, Davis",
        experience: "15+ years in agricultural data analysis and supply chain optimization",
        specialties: ["Demand forecasting", "Price elasticity analysis", "Market trend prediction"],
        email: "sarah.johnson@meatanalytics.com",
        github: "https://github.com/michaelchen",
      },
      {
        name: "Saif Ahmed",
        role: "Full-Stack Developer & System Architect",
        education: "MS in Computer Science, Stanford University",
        experience: "12+ years in web development and database management",
        specialties: ["React/Next.js development", "Database optimization", "API design"],
        email: "michael.chen@meatanalytics.com",
        github: "https://github.com/michaelchen",
      },
      {
        name: "Fahim Hassan",
        role: "Agricultural Economist & Market Analyst",
        education: "PhD in Agricultural and Resource Economics, UC Berkeley",
        experience: "10+ years in agricultural market analysis and policy research",
        specialties: ["Market analysis", "Economic modeling", "Policy impact assessment"],
        email: "emily.rodriguez@meatanalytics.com",
        github: "https://github.com/michaelchen",
      },
      {
        name: "Shihab Khan",
        role: "Supply Chain Specialist & Logistics Coordinator",
        education: "MBA in Supply Chain Management, MIT Sloan",
        experience: "8+ years in meat industry supply chain and logistics",
        specialties: ["Supply chain optimization", "Logistics management", "Inventory control"],
        email: "james.wilson@meatanalytics.com",
        github: "https://github.com/michaelchen",
      },
      {
        name: "Abir Hasan Siam",
        role: "Food Safety Expert & Quality Assurance Manager",
        education: "PhD in Food Science, Cornell University",
        experience: "12+ years in food safety and quality control in meat processing",
        specialties: ["Food safety protocols", "Quality assurance", "Regulatory compliance"],
        email: "lisa.thompson@meatanalytics.com",
        github: "https://github.com/michaelchen",
      },
      {
        name: "Faysal Ahmed",
        role: "Business Intelligence Developer & Data Visualization Specialist",
        education: "MS in Data Science, Carnegie Mellon University",
        experience: "7+ years in business intelligence and data visualization",
        specialties: ["Dashboard development", "Data visualization", "Business intelligence"],
        email: "david.kim@meatanalytics.com",
        github: "https://github.com/davidkim",
      },
      {
        name: "Tanjum Islam",
        role: "Veterinarian & Livestock Health Consultant",
        education: "DVM, University of Pennsylvania School of Veterinary Medicine",
        experience: "15+ years in livestock health and veterinary consulting",
        specialties: ["Livestock health management", "Disease prevention", "Animal welfare"],
        email: "robert.martinez@meatanalytics.com",
        github: "https://github.com/michaelchen",
      },
      {
        name: "AI Assistant",
        role: "Intelligent Data Processing & Analysis Support",
        education: "Advanced Machine Learning and Natural Language Processing",
        experience: "Real-time data processing and intelligent analysis capabilities",
        specialties: ["Automated reporting", "Pattern recognition", "Predictive analytics"],
        email: "ai.support@meatanalytics.com",
      },
    ]

    const companyInfo = {
      name: "MeatAnalytics Pro",
      description: "Advanced Meat Products Demand and Supply Analysis Platform",
      address: "1234 Analytics Drive, Tech Valley, CA 94000",
      phone: "+1 (555) 123-4567",
      email: "info@meatanalytics.com",
      website: "https://www.meatanalytics.com",
      founded: "2020",
      employees: "50+",
      mission: "To revolutionize the meat industry through data-driven insights and advanced analytics",
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground">
            Get in touch with our team of experts and learn more about MeatAnalytics Pro
          </p>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Learn more about MeatAnalytics Pro and how to reach us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{companyInfo.name}</h3>
                  <p className="text-muted-foreground">{companyInfo.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{companyInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{companyInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{companyInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{companyInfo.website}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Founded</p>
                    <p className="text-2xl font-bold text-primary">{companyInfo.founded}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Team Size</p>
                    <p className="text-2xl font-bold text-primary">{companyInfo.employees}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Mission</p>
                  <p className="text-sm text-muted-foreground">{companyInfo.mission}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
            <CardDescription>Meet the experts behind MeatAnalytics Pro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Education</p>
                      <p className="text-sm text-muted-foreground">{member.education}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Experience</p>
                      <p className="text-sm text-muted-foreground">{member.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties?.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      {member.linkedin && (
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-3 w-3" />
                        </Button>
                      )}
                      {member.github && (
                        <Button variant="outline" size="sm">
                          <Github className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard()
      case "shop":
        return renderShop()
      case "products":
        return renderProducts()
      case "orders":
        return renderOrders()
      case "nutrition":
        return renderNutrition()
      case "vendors":
        return renderVendors()
      case "livestock":
        return renderLivestock()
      case "slaughter":
        return renderSlaughter()
      case "warehouse":
        return renderWarehouse()
      case "routes":
        return renderRoutes()
      case "agentorders":
        return renderAgentOrders()
      case "purchases":
        return renderPurchases()
      case "scale":
        return renderScale()
      case "vendororders":
        return renderVendorOrders()
      case "analytics":
        return renderAnalytics()
      case "contact":
        return renderContact()
      case "about":
        return renderAbout()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-red-700">Meatrix</h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveView(item.id)
                  setSidebarOpen(false)
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 text-red-700" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-h-[calc(100vh-80px)] overflow-y-auto">{renderContent()}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New {currentModule.charAt(0).toUpperCase() + currentModule.slice(1)}</DialogTitle>
            <DialogDescription>Fill in the details to add a new {currentModule.slice(0, -1)}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentModule === "products" && (
              <>
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category || ""}
                    onChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beef">Beef</SelectItem>
                      <SelectItem value="Chicken">Chicken</SelectItem>
                      <SelectItem value="Lamb">Lamb</SelectItem>
                      <SelectItem value="Pork">Pork</SelectItem>
                      <SelectItem value="Turkey">Turkey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "livestock" && (
              <>
                <div>
                  <Label htmlFor="type">Animal Type</Label>
                  <Select value={formData.type || ""} onChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cattle">Cattle</SelectItem>
                      <SelectItem value="Pig">Pig</SelectItem>
                      <SelectItem value="Sheep">Sheep</SelectItem>
                      <SelectItem value="Goat">Goat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={formData.breed || ""}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age (months)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="feedType">Feed Type</Label>
                  <Input
                    id="feedType"
                    value={formData.feedType || ""}
                    onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "nutrition" && (
              <>
                <div>
                  <Label htmlFor="animalId">Animal ID</Label>
                  <Input
                    id="animalId"
                    type="number"
                    value={formData.animalId || ""}
                    onChange={(e) => setFormData({ ...formData, animalId: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="feedType">Feed Type</Label>
                  <Input
                    id="feedType"
                    value={formData.feedType || ""}
                    onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity || ""}
                    onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost || ""}
                    onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier || ""}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "slaughter" && (
              <>
                <div>
                  <Label htmlFor="animalId">Animal ID</Label>
                  <Input
                    id="animalId"
                    type="number"
                    value={formData.animalId || ""}
                    onChange={(e) => setFormData({ ...formData, animalId: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Animal Type</Label>
                  <Input
                    id="type"
                    value={formData.type || ""}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Live Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="processedWeight">Processed Weight (lbs)</Label>
                  <Input
                    id="processedWeight"
                    type="number"
                    value={formData.processedWeight || ""}
                    onChange={(e) => setFormData({ ...formData, processedWeight: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="inspector">Inspector</Label>
                  <Input
                    id="inspector"
                    value={formData.inspector || ""}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={formData.grade || ""} onChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentModule === "warehouse" && (
              <>
                <div>
                  <Label htmlFor="item">Item Name</Label>
                  <Input
                    id="item"
                    value={formData.item || ""}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity || ""}
                    onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Storage Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature || ""}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate || ""}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier || ""}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "routes" && (
              <>
                <div>
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="driver">Driver</Label>
                  <Input
                    id="driver"
                    value={formData.driver || ""}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Input
                    id="vehicle"
                    value={formData.vehicle || ""}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stops">Number of Stops</Label>
                  <Input
                    id="stops"
                    type="number"
                    value={formData.stops || ""}
                    onChange={(e) => setFormData({ ...formData, stops: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    value={formData.distance || ""}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time</Label>
                  <Input
                    id="estimatedTime"
                    value={formData.estimatedTime || ""}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "agentorders" && (
              <>
                <div>
                  <Label htmlFor="agent">Agent Name</Label>
                  <Input
                    id="agent"
                    value={formData.agent || ""}
                    onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="products">Products</Label>
                  <Textarea
                    id="products"
                    value={formData.products || ""}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="total">Total Amount</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    value={formData.total || ""}
                    onChange={(e) => setFormData({ ...formData, total: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="commission">Commission</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.01"
                    value={formData.commission || ""}
                    onChange={(e) => setFormData({ ...formData, commission: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </>
            )}

            {currentModule === "purchases" && (
              <>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier || ""}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="items">Items</Label>
                  <Textarea
                    id="items"
                    value={formData.items || ""}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost || ""}
                    onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate || ""}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "scale" && (
              <>
                <div>
                  <Label htmlFor="productType">Product Type</Label>
                  <Input
                    id="productType"
                    value={formData.productType || ""}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Input
                    id="operator"
                    value={formData.operator || ""}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber || ""}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quality">Quality Grade</Label>
                  <Select
                    value={formData.quality || ""}
                    onChange={(value) => setFormData({ ...formData, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade A">Grade A</SelectItem>
                      <SelectItem value="Grade B">Grade B</SelectItem>
                      <SelectItem value="Grade C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentModule === "vendororders" && (
              <>
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor || ""}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="products">Products</Label>
                  <Textarea
                    id="products"
                    value={formData.products || ""}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity || ""}
                    onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="total">Total Amount</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    value={formData.total || ""}
                    onChange={(e) => setFormData({ ...formData, total: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate || ""}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "vendors" && (
              <>
                <div>
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input
                    id="contact"
                    value={formData.contact || ""}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </>
            )}

            {currentModule === "orders" && (
              <>
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={formData.customer || ""}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="items">Items</Label>
                  <Textarea
                    id="items"
                    value={formData.items || ""}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="total">Total Amount</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    value={formData.total || ""}
                    onChange={(e) => setFormData({ ...formData, total: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryTime">Delivery Time</Label>
                  <Input
                    id="deliveryTime"
                    value={formData.deliveryTime || ""}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleAdd(currentModule, formData)} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Modal */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {currentModule.charAt(0).toUpperCase() + currentModule.slice(1)}</DialogTitle>
            <DialogDescription>Update the details for this {currentModule.slice(0, -1)}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as Add Form but with existing data */}
            {/* Implementation would be similar to Add Form but with pre-filled values */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditForm(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleEdit(currentModule, selectedItem?.id, formData)} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {currentModule.slice(0, -1)}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(currentModule, selectedItem?.id)}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
