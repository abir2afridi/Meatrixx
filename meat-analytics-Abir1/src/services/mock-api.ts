import { mockOrders, type Order, mockDistribution, type Distribution, mockProducts, type Product } from "@/data/mock-data"

// Additional types for the dashboard
export interface KPIData {
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

export interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  type: string
  status: string
  createdAt: string
}

export interface Inventory {
  id: string
  productName: string
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
}

export interface Livestock {
  animalId: string
  type: string
  breed: string
  weight: number
  age: number
  healthStatus: 'healthy' | 'sick' | 'quarantine' | 'recovering'
  location: string
  lastVaccination: string
  feedType: string
  notes?: string
}

function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms))
}

let ordersDb: Order[] = [...mockOrders]
let distributionDb: Distribution[] = [...mockDistribution]
let productsDb: (Product & { wholesalePrice?: number; fcr?: number; rearingDays?: number; status?: string; description?: string })[] = [...mockProducts]
let vendorsDb: Vendor[] = [
  { id: "1", name: "Dhaka Suppliers", email: "contact@dhakasuppliers.com", phone: "+880 1234 567890", type: "supplier", status: "active", createdAt: new Date().toISOString() },
  { id: "2", name: "Chittagong Meat Co.", email: "info@chittagongmeat.com", phone: "+880 1234 567891", type: "distributor", status: "active", createdAt: new Date().toISOString() },
  { id: "3", name: "Sylhet Fresh", email: "orders@sylhetfresh.com", phone: "+880 1234 567892", type: "retailer", status: "active", createdAt: new Date().toISOString() }
]
let inventoryDb: Inventory[] = [
  { id: "1", productName: "Premium Beef Steak", currentStock: 150, minStockLevel: 50, maxStockLevel: 300 },
  { id: "2", productName: "Organic Chicken", currentStock: 80, minStockLevel: 100, maxStockLevel: 250 },
  { id: "3", productName: "Fresh Mutton", currentStock: 200, minStockLevel: 75, maxStockLevel: 200 },
  { id: "4", productName: "River Fish Fillet", currentStock: 120, minStockLevel: 60, maxStockLevel: 180 }
]
let livestockDb: Livestock[] = []

export const mockApi = {
  // KPI and Analytics
  async getKPIs(): Promise<KPIData> {
    await delay()
    return {
      totalProducts: productsDb.length,
      totalVendors: vendorsDb.length,
      totalOrders: ordersDb.length,
      activeOrders: ordersDb.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length,
      fastestSellingProduct: "Premium Beef Steak",
      topSellingRegion: "Dhaka",
      avgFCR: 2.1,
      avgWeight: 1.5,
      avgRearingDays: 90,
      avgWholesalePrice: 450,
      avgRetailPrice: 600,
      totalRevenue: 125000,
      monthlyGrowthRate: 18.5,
      weeklyOrderGrowth: 12.3
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
    await delay()
    return [...productsDb]
  },

  async createProduct(productData: any): Promise<Product> {
    await delay()
    const newProduct = {
      ...productData,
      id: `p${productsDb.length + 1}`,
    }
    productsDb.push(newProduct)
    return newProduct
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    await delay()
    return [...ordersDb]
  },

  async getOrdersWithDetails(): Promise<(Order & { vendorName: string; productName: string })[]> {
    await delay()
    return ordersDb.map((o) => ({
      ...o,
      vendorName: o.vendorName || "Vendor",
      productName: o.productName || "Product",
    }))
  },

  async createOrder(orderData: Omit<Order, "id">): Promise<Order> {
    await delay()
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
    }
    ordersDb.push(newOrder)
    return newOrder
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
    await delay()
    ordersDb = ordersDb.map((o) => (o.id === id ? { ...o, status } : o))
  },

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    await delay()
    return [...vendorsDb]
  },

  async createVendor(vendorData: Omit<Vendor, "id">): Promise<Vendor> {
    await delay()
    const newVendor: Vendor = {
      ...vendorData,
      id: `${vendorsDb.length + 1}`,
    }
    vendorsDb.push(newVendor)
    return newVendor
  },

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    await delay()
    return [...inventoryDb]
  },

  // Livestock
  async createLivestock(livestockData: Livestock): Promise<Livestock> {
    await delay()
    livestockDb.push(livestockData)
    return livestockData
  },

  async getLivestock(): Promise<Livestock[]> {
    await delay()
    return [...livestockDb]
  },

  // Distribution APIs
  async getDistribution(): Promise<Distribution[]> {
    await delay()
    return [...distributionDb]
  },

  async createDistribution(data: any): Promise<Distribution> {
    await delay()
    const now = new Date().toISOString()
    const newItem: Distribution = {
      id: data.routeId || `R-${Math.floor(Math.random() * 9000 + 1000)}`,
      routeNumber: data.routeId || `Route-${Math.floor(Math.random() * 9000 + 1000)}`,
      driverName: data.driverName,
      vehicleId: data.vehicleNumber || "N/A",
      origin: data.startLocation,
      destination: data.endLocation,
      distance: data.distance,
      temperature: data.temperature,
      scheduledDate: new Date().toISOString().split('T')[0],
      estimatedTime: data.estimatedTime,
      status: data.status,
      products: data.products || [],
      gpsLocation: true,
      createdAt: now,
      updatedAt: now,
    }
    distributionDb.push(newItem)
    return newItem
  },

  async updateDistribution(
    id: string,
    data: Omit<Distribution, "id" | "createdAt" | "updatedAt">
  ): Promise<Distribution | null> {
    await delay()
    let updated: Distribution | null = null
    distributionDb = distributionDb.map((d) => {
      if (d.id === id) {
        updated = { ...d, ...data, id, updatedAt: new Date().toISOString() }
        return updated
      }
      return d
    })
    return updated
  },
}
