"use client"

import type { ReactNode } from "react"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        {children}
      </div>
    </div>
  )
}
