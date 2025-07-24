import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AI Knowledgebase",
    template: "%s | AI Knowledgebase",
  },
  description: "AI-powered knowledge management system for organizing and summarizing your content",
  keywords: ["AI", "knowledge management", "articles", "summarization", "search"],
  authors: [{ name: "AI Knowledgebase Team" }],
  creator: "AI Knowledgebase",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-knowledgebase.vercel.app",
    title: "AI Knowledgebase",
    description: "AI-powered knowledge management system",
    siteName: "AI Knowledgebase",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Knowledgebase",
    description: "AI-powered knowledge management system",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
