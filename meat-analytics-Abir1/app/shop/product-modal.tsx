"use client"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Product } from "@/data/mock-data"

export function ProductModal({
  product,
  open,
  onClose,
  onAddToCart,
}: {
  product: Product
  open: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {product.breed} • {product.weight}kg • {product.district}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative w-full aspect-video overflow-hidden rounded-md bg-muted">
            {/* Using img to avoid next/image config issues */}
            <img
              src={product.image || "/placeholder.svg?height=300&width=600"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{product.type}</Badge>
            <div>
              <span className="text-2xl font-bold text-red-600">৳{product.retailPrice}</span>
              <span className="text-sm text-muted-foreground ml-1">per kg</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => onAddToCart(product)}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
