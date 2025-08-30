"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Smartphone, Banknote, MapPin, User } from "lucide-react"
import { useCart } from "../../hooks/use-cart"
import type { CartItem } from "../../hooks/use-cart"
import { PaymentModal } from "./payment-modal"
import { toast } from "sonner"

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
  notes: string
}

export function CheckoutContent() {
  const router = useRouter()
  const { cart, getTotalPrice, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    notes: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<string>("cod")
  const [deliveryMethod, setDeliveryMethod] = useState<string>("standard")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const deliveryOptions = {
    standard: { name: "Standard Delivery", time: "3-5 days", cost: 50 },
    express: { name: "Express Delivery", time: "1-2 days", cost: 150 },
    scheduled: { name: "Scheduled Delivery", time: "Choose date", cost: 100 },
  }

  const subtotal = getTotalPrice()
  const deliveryCost = deliveryOptions[deliveryMethod as keyof typeof deliveryOptions].cost
  const total = subtotal + deliveryCost

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const required = ["name", "email", "phone", "address", "city", "district"]
    const missing = required.filter((field) => !customerInfo[field as keyof CustomerInfo])

    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`)
      return false
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return false
    }

    return true
  }

  const handlePlaceOrder = () => {
    if (!validateForm()) return

    if (paymentMethod === "cod") {
      processOrder()
    } else {
      setShowPaymentModal(true)
    }
  }

  const processOrder = async () => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const orderId = `ORD-${Date.now()}`

    // Store order in localStorage
    const order = {
      id: orderId,
      items: cart,
      customerInfo,
      paymentMethod,
      deliveryMethod,
      subtotal,
      deliveryCost,
      total,
      status: "Order Placed",
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    }

    const existingOrders = JSON.parse(localStorage.getItem("customer-orders") || "[]")
    localStorage.setItem("customer-orders", JSON.stringify([order, ...existingOrders]))

    clearCart()
    setIsProcessing(false)

    toast.success("Order placed successfully!")
    router.push(`/order-confirmation?orderId=${orderId}`)
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart before checkout.</p>
            <Button onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+880 1X XXXX XXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={customerInfo.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="e.g., Dhaka"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your full address"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={customerInfo.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  value={customerInfo.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special delivery instructions..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                {Object.entries(deliveryOptions).map(([key, option]) => (
                  <div key={key} className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">{option.time}</p>
                        </div>
                        <Badge variant="outline">৳{option.cost}</Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Mobile Banking</p>
                        <p className="text-sm text-muted-foreground">bKash, Nagad, Rocket</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ৳{item.price}
                    </p>
                  </div>
                  <p className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>৳{deliveryCost}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order - ৳${total.toFixed(2)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentMethod={paymentMethod}
        total={total}
        onPaymentSuccess={processOrder}
      />
    </div>
  )
}
