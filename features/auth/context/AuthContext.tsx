"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { AuthUser } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData.user)
          } else {
            localStorage.removeItem("auth_token")
          }
        } catch (error) {
          console.error("Auth initialization error:", error)
          localStorage.removeItem("auth_token")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (user: AuthUser, token: string) => {
    setUser(user)
    localStorage.setItem("auth_token", token)
  }

  const logout = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
