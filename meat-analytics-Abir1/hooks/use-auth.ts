"use client"

import { useCallback } from "react"

export type UserRole = "Admin" | "Supplier" | "Retailer" | "Analyst"

// Very simple demo auth using localStorage. Replace with real API as needed.
const DEMO_USERS: Array<{ email: string; password: string; name: string; role: UserRole }> = [
  { email: "admin@meat.com", name: "Admin User", password: "password", role: "Admin" },
  { email: "supplier@meat.com", name: "Supplier User", password: "password", role: "Supplier" },
  { email: "retailer@meat.com", name: "Retailer User", password: "password", role: "Retailer" },
  { email: "analyst@meat.com", name: "Analyst User", password: "password", role: "Analyst" },
]

const USERS_KEY = "meat_users"
const CURRENT_USER_KEY = "meat_current_user"

type StoredUser = { email: string; password: string; name: string; role: UserRole }

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [...DEMO_USERS]
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return [...DEMO_USERS]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [...DEMO_USERS]
    return [...DEMO_USERS, ...parsed.filter((u: any) => u && u.email && u.password)]
  } catch {
    return [...DEMO_USERS]
  }
}

function saveUser(user: StoredUser) {
  if (typeof window === "undefined") return
  const current = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as StoredUser[]
  current.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(current))
}

function setCurrentUser(user: Omit<StoredUser, "password"> | null) {
  if (typeof window === "undefined") return
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(CURRENT_USER_KEY)
}

export function useAuth() {
  const getCurrentUser = useCallback((): Omit<StoredUser, "password"> | null => {
    if (typeof window === "undefined") return null
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY)
      if (!raw) return null
      return JSON.parse(raw)
    } catch {
      return null
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const users = loadUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      setCurrentUser({ email: found.email, name: found.name, role: found.role })
      return true
    }
    return false
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
      const users = loadUsers()
      const exists = users.some((u) => u.email === email)
      if (exists) return false
      const newUser: StoredUser = { email, password, name, role }
      saveUser(newUser)
      setCurrentUser({ email, name, role })
      return true
    },
    []
  )

  const logout = useCallback(async () => {
    setCurrentUser(null)
  }, [])

  return { 
    login, 
    register, 
    logout, 
    user: getCurrentUser()
  }
}
