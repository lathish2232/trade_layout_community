'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 })

  const handleMouseEnter = (e: React.MouseEvent) => {
    const iconRect = e.currentTarget.getBoundingClientRect()
    const buttonRect = e.currentTarget.closest('.group')?.querySelector('a')?.getBoundingClientRect()
    if (buttonRect) {
      setIconPosition({ top: buttonRect.top + buttonRect.height / 2, left: buttonRect.right })
    } else {
      // Fallback to icon position if button not found
      setIconPosition({ top: iconRect.top + iconRect.height / 2, left: iconRect.right })
    }
    setIsVisible(true)
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.stopPropagation()
          const iconRect = e.currentTarget.getBoundingClientRect()
          const buttonRect = e.currentTarget.closest('.group')?.querySelector('a')?.getBoundingClientRect()
          if (buttonRect) {
            setIconPosition({ top: buttonRect.top + buttonRect.height / 2, left: buttonRect.right })
          } else {
            // Fallback to icon position if button not found
            setIconPosition({ top: iconRect.top + iconRect.height / 2, left: iconRect.right })
          }
          setIsVisible(!isVisible)
        }}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div 
          className="fixed z-[99999] w-64 p-2 bg-white text-gray-800 text-sm rounded-md shadow-xl whitespace-normal border border-gray-200"
          style={{ 
            top: `${iconPosition.top}px`, 
            left: `${iconPosition.left + 12}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-200"></div>
          {text}
        </div>
      )}
    </div>
  )
}

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

        {/* Create Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Create</h3>
          <div className="space-y-2">
            <div className="group relative">
              <Link 
                href="/query/create"
                className="block w-full bg-pink-500 text-white font-medium py-3 px-3 rounded-md transition-all duration-200 text-left shadow-lg shadow-pink-500/50 mb-2 hover:scale-95"
                title="Ask a question and get help from the community"
              >
                Query
              </Link>
            </div>
            
            <div className="group relative">
              <Link 
                href="/create/discussion"
                className="block w-full bg-pink-500 text-white font-medium py-3 px-3 rounded-md transition-all duration-200 text-left shadow-lg shadow-pink-500/50 mb-2 hover:scale-95"
                title="Start an open conversation to share ideas and opinions"
              >
                Discussion
              </Link>
            </div>
            
            <div className="group relative">
              <Link 
                href="/create/article"
                className="block w-full bg-pink-500 text-white font-medium py-3 px-3 rounded-md transition-all duration-200 text-left shadow-lg shadow-pink-500/50 mb-2 hover:scale-95"
                title="Publish a detailed guide, analysis, or research post"
              >
                Article
              </Link>
            </div>
          </div>
        </div>

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

        {/* Forum Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Forum Stats</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Posts</span>
                <span className="font-medium text-gray-900">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium text-gray-900">567</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Today's Posts</span>
                <span className="font-medium text-gray-900">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
