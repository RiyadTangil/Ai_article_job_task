"use client"

import type React from "react"

import { useAuth } from "@/features/auth/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
