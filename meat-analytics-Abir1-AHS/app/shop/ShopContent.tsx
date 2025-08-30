"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Plus, Search, Filter, Star, Heart, Eye } from "lucide-react"
import { mockProducts, type Product } from "@/data/mock-data"
import { useCart } from "@/hooks/use-cart"
import { ProductModal } from "./product-modal"
import { CartSidebar } from "./cart-sidebar"
import { toast } from "sonner"

export function ShopContent() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cartAnimation, setCartAnimation] = useState(false)
  const router = useRouter()

  const { cart, addToCart, updateQuantity, removeFromCart, getItemCount, getTotalPrice } = useCart()

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.breed.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.type === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.retailPrice,
      image: product.image || `/placeholder.svg?height=200&width=200&query=${product.name}`,
    })

    setCartAnimation(true)
    setTimeout(() => setCartAnimation(false), 600)
    toast.success(`${product.name} added to cart!`, {
      description: `৳${product.retailPrice} per kg`,
      duration: 2000,
    })
  }

  const handleBuyNow = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.retailPrice,
      image: product.image || `/placeholder.svg?height=200&width=200&query=${product.name}`,
    })
    toast.success(`${product.name} added to cart!`)
    // Navigate directly to checkout (project uses /checkout)
    router.push("/checkout")
  }

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
      toast.success("Removed from favorites")
    } else {
      newFavorites.add(productId)
      toast.success("Added to favorites")
    }
    setFavorites(newFavorites)
  }

  const getQualityBadge = (product: Product) => {
    const price = product.retailPrice
    if (price > 800) return { label: "Premium", variant: "default" as const }
    if (price > 600) return { label: "Grade A", variant: "secondary" as const }
    if (price > 400) return { label: "Grade B", variant: "outline" as const }
    return { label: "Standard", variant: "outline" as const }
  }

  const getNutritionalInfo = (product: Product) => {
    // Mock nutritional data based on product type
    const baseNutrition = {
      beef: { protein: 26, calories: 250, fat: 15, carbs: 0 },
      chicken: { protein: 31, calories: 165, fat: 3.6, carbs: 0 },
      mutton: { protein: 25, calories: 294, fat: 21, carbs: 0 },
      fish: { protein: 22, calories: 206, fat: 12, carbs: 0 },
    }
    return baseNutrition[product.type as keyof typeof baseNutrition] || baseNutrition.beef
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.type)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Meat Shop
          </h1>
          <p className="text-slate-600 mt-2">Fresh, quality meat products delivered to your door</p>
        </div>
        <Button
          onClick={() => setCartOpen(true)}
          className={`relative bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 hover-lift transition-all duration-300 ${cartAnimation ? "animate-bounce-in" : ""}`}
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({getItemCount()})
          {getItemCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-orange-500 text-white animate-pulse-glow">
              {getItemCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-effect border-slate-200 hover-lift transition-all duration-300 animate-slide-in-left">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-300 focus:border-red-400 focus:ring-red-400 focus:ring-2 transition-all duration-300"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 border-slate-300 focus:border-red-400 focus:ring-red-400 focus:ring-2 transition-all duration-300">
                <Filter className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-slate-200">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="hover:bg-red-50">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
        {filteredProducts.map((product, index) => {
          const qualityBadge = getQualityBadge(product)
          const nutrition = getNutritionalInfo(product)

          return (
            <Card
              key={product.id}
              className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border-slate-200 bg-white/80 backdrop-blur-sm overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || `/placeholder.svg?height=200&width=300&query=${product.name} ${product.type}`}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-lg hover-scale transition-all duration-300"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors duration-300 ${favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-slate-600"}`}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-lg hover-scale transition-all duration-300"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="h-4 w-4 text-slate-600" />
                    </Button>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge className="bg-white/95 text-slate-700 hover:bg-white shadow-sm" variant="secondary">
                      {product.type}
                    </Badge>
                    <Badge
                      variant={qualityBadge.variant}
                      className={`shadow-sm ${qualityBadge.variant === "default" ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" : ""}`}
                    >
                      {qualityBadge.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {product.breed} • {product.weight}kg
                  </p>
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                    <span className="font-medium text-slate-700">Nutrition:</span> Protein: {nutrition.protein}g •
                    Calories: {nutrition.calories} • Fat: {nutrition.fat}g
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-slate-500 ml-2">(4.8)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                        ৳{product.retailPrice}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">per kg</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-slate-300 text-slate-600">
                        {product.district}
                      </Badge>
                      <div className="text-xs text-slate-400 mt-1">Region</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 hover-lift transition-all duration-300 relative overflow-hidden group/btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                    <Plus className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Add to Cart</span>
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 hover-lift transition-all duration-300 relative overflow-hidden group/btn"
                    onClick={() => handleBuyNow(product)}
                  >
                    <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                    <span className="relative z-10">Buy Now</span>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-slate-300 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 bg-transparent"
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="glass-effect border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="animate-fade-in-up">
              <Search className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
              <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onGoToCheckout={() => router.push("/checkout")}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
      />
    </div>
  )
}
