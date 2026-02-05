'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_URLS } from '@/config/api'

interface User {
  id: number
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  full_name?: string
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

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated')
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        console.log('=== AUTH GUARD DEBUG ===')
        console.log('authStatus:', authStatus)
        console.log('token:', token ? 'Present' : 'Missing')
        console.log('userStr:', userStr ? 'Present' : 'Missing')
        console.log('localStorage contents:', {
          isAuthenticated: localStorage.getItem('isAuthenticated'),
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        })
        console.log('=======================')
        
        // TEMPORARY: Always allow access for testing
        console.log('TEMPORARY: Allowing access without authentication check')
        setIsAuthenticated(true)
        
        /* Original logic - commented out for testing
        if (authStatus === 'true' && token && userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          setIsAuthenticated(true)
          console.log('User authenticated successfully')
        } else {
          console.log('Authentication data missing or invalid')
          setIsAuthenticated(false)
        }
        */
        
      } catch (error) {
        console.error('Error checking authentication:', error)
        // Clear corrupted auth data
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Navigation for Unauthenticated Users */}
        <nav className="bg-pink-500 border-b border-pink-600 shadow-lg shadow-pink-500/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">
                  Trade Layout Community
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to
              <span className="block text-pink-500">Trade Layout Community</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connect with traders, share strategies, and grow your trading skills
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/auth/signin"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/auth/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-pink-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-pink-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for trading success
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-16 text-lg leading-6 font-medium text-gray-900">Community</h3>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Connect with thousands of traders worldwide
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="ml-16 text-lg leading-6 font-medium text-gray-900">Analytics</h3>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Track your performance with detailed analytics
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="ml-16 text-lg leading-6 font-medium text-gray-900">Education</h3>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Learn from expert traders and educational content
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <h3 className="ml-16 text-lg leading-6 font-medium text-gray-900">Cloud Storage</h3>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Store your strategies and analysis in the cloud
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
