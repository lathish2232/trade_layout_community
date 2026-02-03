'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: number
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  full_name?: string
  phone_number?: string
  avatar_url?: string
  auth_provider: 'google' | 'email'
  provider_id?: string
  is_oauth_user: boolean
  created_at: string
  updated_at: string
  is_active: boolean
  email_verified: boolean
  last_login: string
}

export default function ProfileNavigation() {
  const router = useRouter()
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
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <nav className="bg-pink-500 border-b border-pink-600 shadow-lg shadow-pink-500/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">
              Trade Layout Community
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Queries Link - Only show if phone number exists */}
            {user && user.phone_number && (
              <Link
                href="/query"
                className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
              >
                Queries
              </Link>
            )}
            
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3">
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
              </div>
            )}
            
            {/* Sign Out Button */}
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
