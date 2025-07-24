"use client"

import { useState } from "react"

export default function Component() {
  const [activeTab, setActiveTab] = useState("customer")

  const tabs = [
    { id: "customer", label: "Register as a Customer", hasIcon: true },
    { id: "vendor", label: "Register as a Vendor", hasIcon: false },
    { id: "affiliate", label: "Register as an Affiliate", hasIcon: false },
  ]

  return (
    <div className="flex items-center gap-2 p-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors
            ${
              activeTab === tab.id
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "text-gray-500 border-gray-300 hover:text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          {tab.hasIcon && activeTab === tab.id && (
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
