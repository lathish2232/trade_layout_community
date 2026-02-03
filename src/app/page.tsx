'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated')
    const isAuth = authStatus === 'true'
    setIsAuthenticated(isAuth)
    
    // Redirect authenticated users to forum
    if (isAuth) {
      window.location.href = '/forum'
    }
  }, [])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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
              <Link
                href="/auth/signup"
                className="bg-white text-pink-500 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to Trade Layout Community
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Share your trading strategies, ask questions, and connect with fellow traders worldwide in real-time.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 transition-all duration-200 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white mx-auto mb-4">
              <span className="text-xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Discussions</h3>
            <p className="text-gray-600">Engage in live trading discussions with experts and enthusiasts.</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white mx-auto mb-4">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Share Strategies</h3>
            <p className="text-gray-600">Post and discover proven trading strategies from the community.</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white mx-auto mb-4">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Network & Learn</h3>
            <p className="text-gray-600">Connect with traders worldwide and expand your knowledge.</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white mx-auto mb-4">
              <span className="text-xl">🏠</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Home</h3>
            <p className="text-gray-600">Your personal dashboard for trading insights and community updates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
