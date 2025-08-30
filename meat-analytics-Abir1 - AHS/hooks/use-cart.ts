"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

export type CartItem = {
  id: number | string
  name: string
  price: number
  quantity: number
  image?: string
  stock?: number
  [key: string]: any
}

export type UseCart = {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number | string) => void
  updateQuantity: (id: number | string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

const STORAGE_KEY = "cart-storage"

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // ignore
  }
}

export function useCart(): UseCart {
  const [cart, setCart] = useState<CartItem[]>(() => readCartFromStorage())

  // Sync with storage events (multi-tab / route changes)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setCart(readCartFromStorage())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Persist on change
  useEffect(() => {
    writeCartToStorage(cart)
  }, [cart])

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: number | string) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: number | string, quantity: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const getTotalPrice = useCallback(() => {
    return cart.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)
  }, [cart])

  const getItemCount = useCallback(() => {
    return cart.reduce((sum, i) => sum + Number(i.quantity), 0)
  }, [cart])

  // Memoize API so referential identity is stable
  return useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getItemCount }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getItemCount]
  )
}
