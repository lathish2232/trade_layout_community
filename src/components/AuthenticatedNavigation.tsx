'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: number
  user_id: string
  email: string
  display_name?: string
  full_name?: string
  avatar_url?: string
}

export default function AuthenticatedNavigation() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const getUserData = () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }

    getUserData()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <nav className="bg-pink-500 border-b border-pink-600 shadow-lg shadow-pink-500/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/community_feed" className="text-xl font-bold text-white hover:text-pink-100 transition-colors duration-200">
              Trade Layout Community
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/community_feed"
                className="text-white hover:text-pink-100 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Community Feed</span>
              </Link>
              <Link
                href="/query"
                className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
              >
                Queries
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Profile Display */}
            {user && (
              <Link href="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                {user.avatar_url ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar_url}
                    alt="Profile"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-white text-sm font-medium">
                  {user.display_name || user.full_name || user.email}
                </span>
              </Link>
            )}
            
            <button
              onClick={handleSignOut}
              className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
