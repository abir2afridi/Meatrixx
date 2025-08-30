"use client"

import { useMemo } from "react"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

// Minimal mock auth hook to satisfy dashboard needs
export function useAuth() {
  const user: AuthUser = useMemo(
    () => ({ id: "u1", name: "Admin", email: "admin@example.com", role: "Administrator" }),
    []
  )
  return { user }
}
