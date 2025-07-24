"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles, Shield, Zap, Users } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showBackButton?: boolean
}

export function AuthLayout({ children, title, subtitle, showBackButton = false }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Knowledgebase</h1>
              <p className="text-blue-100 text-sm">Powered by Intelligence</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Transform Your Knowledge Management
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Harness the power of AI to organize, search, and summarize your content like never before.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Secure & Private</h3>
                <p className="text-blue-100 text-sm">Enterprise-grade security for your data</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Lightning Fast</h3>
                <p className="text-blue-100 text-sm">Instant search and AI-powered insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Team Collaboration</h3>
                <p className="text-blue-100 text-sm">Share and collaborate seamlessly</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-blue-200 text-sm">
              Trusted by 10,000+ knowledge workers worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {showBackButton && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          )}

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">{subtitle}</p>
            </div>

            {children}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
