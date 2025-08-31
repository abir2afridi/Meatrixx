export type Order = {
  id: string
  vendorId?: string
  productId?: string
  vendorName?: string
  productName?: string
  quantity: number
  unitPrice: number
  totalAmount: number
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  orderDate: string
  deliveryDate?: string
}

export const mockVendors = [
  { id: "v1", name: "Premium Meat Co." },
  { id: "v2", name: "Farm Fresh Suppliers" },
]

export type Product = {
  id: string
  name: string
  type: "beef" | "chicken" | "mutton" | "fish"
  breed: string
  weight: number
  retailPrice: number
  district: string
  image?: string
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Beef Steak",
    type: "beef",
    breed: "Angus",
    weight: 1.0,
    retailPrice: 850,
    district: "Dhaka",
    image: "/juicy-beef-steak.png",
  },
  {
    id: "p2",
    name: "Organic Chicken",
    type: "chicken",
    breed: "Free-range",
    weight: 2.0,
    retailPrice: 480,
    district: "Chattogram",
    image: "/grilled-chicken-bangla.png",
  },
  {
    id: "p3",
    name: "Fresh Mutton",
    type: "mutton",
    breed: "Black Bengal",
    weight: 1.2,
    retailPrice: 720,
    district: "Rajshahi",
    image: "/grilled-lamb-chops.png",
  },
  {
    id: "p4",
    name: "River Fish Fillet",
    type: "fish",
    breed: "Rui",
    weight: 0.8,
    retailPrice: 380,
    district: "Khulna",
    image: "/juicy-beef-steak.png",
  },
]

export const mockOrders: Order[] = [
  {
    id: "ORD-1001",
    vendorId: "v1",
    productId: "p1",
    vendorName: "Premium Meat Co.",
    productName: "Beef Steak",
    quantity: 10,
    unitPrice: 25,
    totalAmount: 250,
    status: "Processing",
    orderDate: "2025-08-25",
    deliveryDate: "2025-09-02",
  },
  {
    id: "ORD-1002",
    vendorId: "v2",
    productId: "p2",
    vendorName: "Farm Fresh Suppliers",
    productName: "Organic Chicken",
    quantity: 20,
    unitPrice: 12,
    totalAmount: 240,
    status: "Pending",
    orderDate: "2025-08-28",
  },
]

// Distribution types and mock data
export type Distribution = {
  id: string
  routeNumber: string
  driverName: string
  vehicleId: string
  origin: string
  destination: string
  distance: number
  temperature: number
  scheduledDate: string
  estimatedTime: string
  status: "Scheduled" | "In Transit" | "Delivered" | "Delayed" | "Cancelled"
  products: { productName: string; quantity: number }[]
  gpsLocation?: boolean
  createdAt: string
  updatedAt: string
}

export const mockDistribution: Distribution[] = [
  {
    id: "R-1001",
    routeNumber: "Route-1001",
    driverName: "Mike Johnson",
    vehicleId: "Truck-001",
    origin: "Dhaka",
    destination: "Chattogram",
    distance: 265,
    temperature: 4,
    scheduledDate: "2025-09-01",
    estimatedTime: "6h 30m",
    status: "In Transit",
    products: [
      { productName: "Beef Cuts", quantity: 120 },
      { productName: "Chicken Breast", quantity: 200 },
    ],
    gpsLocation: true,
    createdAt: "2025-08-30T10:00:00Z",
    updatedAt: "2025-08-30T12:00:00Z",
  },
  {
    id: "R-1002",
    routeNumber: "Route-1002",
    driverName: "Sarah Lee",
    vehicleId: "Truck-014",
    origin: "Rajshahi",
    destination: "Dhaka",
    distance: 245,
    temperature: 3,
    scheduledDate: "2025-09-02",
    estimatedTime: "5h 45m",
    status: "Scheduled",
    products: [
      { productName: "Mutton", quantity: 80 },
      { productName: "Fish Fillet", quantity: 150 },
    ],
    gpsLocation: false,
    createdAt: "2025-08-30T09:00:00Z",
    updatedAt: "2025-08-30T09:00:00Z",
  },
]
