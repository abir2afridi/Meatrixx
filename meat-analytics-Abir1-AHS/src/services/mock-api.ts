import { mockOrders, type Order, mockDistribution, type Distribution } from "@/data/mock-data"
import { mockProducts, type Product, mockVendors } from "@/data/mock-data"

function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms))
}

let ordersDb: Order[] = [...mockOrders]
let distributionDb: Distribution[] = [...mockDistribution]
let productsDb: Product[] = [...mockProducts]
let vendorsDb: { id: string; name: string; email?: string; phone?: string; address?: string; type?: string; status?: string; createdAt?: string }[] = [...mockVendors]

export const mockApi = {
  async getKPIs(): Promise<{
    totalProducts: number
    totalVendors: number
    totalOrders: number
    totalRevenue: number
    avgFCR: number
    avgWeight: number
    avgWholesalePrice: number
    avgRetailPrice: number
  }> {
    await delay()
    const totalRevenue = ordersDb.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    const avgWeight = productsDb.length
      ? productsDb.reduce((s, p) => s + (p.weight || 0), 0) / productsDb.length
      : 0
    const avgRetailPrice = productsDb.length
      ? productsDb.reduce((s, p) => s + (p.retailPrice || 0), 0) / productsDb.length
      : 0
    const avgWholesalePrice = avgRetailPrice * 0.8
    return {
      totalProducts: productsDb.length,
      totalVendors: vendorsDb.length,
      totalOrders: ordersDb.length,
      totalRevenue,
      avgFCR: 2.1,
      avgWeight,
      avgWholesalePrice,
      avgRetailPrice,
    }
  },

  async getProducts(): Promise<Product[]> {
    await delay()
    return [...productsDb]
  },

  async createProduct(
    data: Partial<Product> & { wholesalePrice?: number; description?: string; fcr?: number; rearingDays?: number }
  ): Promise<Product> {
    await delay()
    const newItem: Product = {
      id: data.id || `P-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: data.name || "New Product",
      type: (data.type as Product["type"]) || "beef",
      breed: (data as any).breed || "",
      weight: Number(data.weight || 0),
      retailPrice: Number(data.retailPrice || 0),
      district: data.district || "Dhaka",
      image: data.image,
    }
    productsDb.push(newItem)
    return newItem
  },

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

  // Distribution APIs
  async getDistribution(): Promise<Distribution[]> {
    await delay()
    return [...distributionDb]
  },

  async createDistribution(data: Omit<Distribution, "id" | "createdAt" | "updatedAt">): Promise<Distribution> {
    await delay()
    const now = new Date().toISOString()
    const newItem: Distribution = {
      ...data,
      id: `R-${Math.floor(Math.random() * 9000 + 1000)}`,
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

  // Vendors
  async getVendors(): Promise<typeof vendorsDb> {
    await delay()
    return [...vendorsDb]
  },

  async createVendor(data: {
    name: string
    email?: string
    phone?: string
    address?: string
    type?: string
  }): Promise<typeof vendorsDb[number]> {
    await delay()
    const item = {
      id: `V-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: "active",
      createdAt: new Date().toISOString(),
      ...data,
    }
    vendorsDb.push(item)
    return item
  },

  // Inventory (synthetic)
  async getInventory(): Promise<{ productName: string; currentStock: number; minStockLevel: number; maxStockLevel: number }[]> {
    await delay()
    return productsDb.map((p) => ({
      productName: p.name,
      currentStock: Math.floor(50 + Math.random() * 150),
      minStockLevel: 40,
      maxStockLevel: 200,
    }))
  },

  // Livestock stub for compatibility
  async createLivestock(data: any): Promise<any> {
    await delay()
    return { ...data }
  },
}

