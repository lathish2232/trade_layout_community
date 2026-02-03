'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(authStatus === 'true')
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Join Trade Layout</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Connect with traders and share strategies
            </p>
            <Link 
              href="/auth/signin"
              className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 text-center shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        
        {/* Create Query Button */}
        <Link 
          href="/query/create"
          className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 text-center mb-6 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
        >
          Create Query
        </Link>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Links</h3>
          <div className="space-y-2">
            <Link 
              href="/forum" 
              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              📝 Forum Posts
            </Link>
            <Link 
              href="/query" 
              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              ❓ Browse Queries
            </Link>
            <Link 
              href="/forum/create" 
              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              ✍️ Create Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
