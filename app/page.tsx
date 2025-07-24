"use client"

import Link from "next/link"
import { useAuth } from "@/features/auth/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">AI Knowledgebase</h1>
        <p className="text-gray-600 mb-8">Organize and manage your knowledge with AI-powered summarization</p>
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
