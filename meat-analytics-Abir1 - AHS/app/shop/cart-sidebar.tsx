"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import type { CartItem } from "@/hooks/use-cart"

type CartApi = {
  cart: CartItem[]
  updateQuantity: (id: number | string, quantity: number) => void
  removeFromCart: (id: number | string) => void
  getTotalPrice: () => number
}

export function CartSidebar({
  open,
  onClose,
  onGoToCheckout,
  cart: cartProp,
  updateQuantity: updateQuantityProp,
  removeFromCart: removeFromCartProp,
  getTotalPrice: getTotalPriceProp,
}: {
  open: boolean
  onClose: () => void
  onGoToCheckout?: () => void
  cart?: CartApi["cart"]
  updateQuantity?: CartApi["updateQuantity"]
  removeFromCart?: CartApi["removeFromCart"]
  getTotalPrice?: CartApi["getTotalPrice"]
}) {
  // Fallback to internal cart if not provided from parent
  const internal = useCart()
  const cart = cartProp ?? internal.cart
  const updateQuantity = updateQuantityProp ?? internal.updateQuantity
  const removeFromCart = removeFromCartProp ?? internal.removeFromCart
  const getTotalPrice = getTotalPriceProp ?? internal.getTotalPrice

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[420px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Review your selected items and proceed to checkout.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {cart.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}

          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-md">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover rounded shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" title={item.name}>{item.name}</div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">৳{Number(item.price).toFixed(2)} each</div>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}>-</Button>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    value={String(item.quantity)}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1)
                      updateQuantity(item.id, v)
                    }}
                    className="w-16 h-8 text-center"
                  />
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}>+</Button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0 text-right">
                <div className="font-semibold whitespace-nowrap">৳{(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
                <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-xl font-bold">৳{getTotalPrice().toFixed(2)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Continue Shopping</Button>
          <Button className="flex-1" disabled={cart.length === 0} onClick={() => onGoToCheckout?.()}>
            Go to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
