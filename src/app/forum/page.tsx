'use client'

import AuthGuard from '@/components/AuthGuard'
import { useState } from 'react'
import Link from 'next/link'

// Mock data for forum posts
const mockPosts = [
  {
    id: 1,
    title: "Best strategies for day trading crypto",
    content: "I've been day trading crypto for 6 months and wanted to share some strategies that have worked well for me. Focus on high-volume coins during peak hours...",
    author: {
      id: 1,
      username: "CryptoTrader99",
      avatar: "/api/placeholder/40/40"
    },
    likes: 45,
    comments: 12,
    views: 234,
    createdAt: "2024-01-15T10:30:00Z",
    category: "Strategies",
    tags: ["crypto", "day-trading", "strategies"]
  },
  {
    id: 2,
    title: "Technical analysis: RSI vs MACD - which is better?",
    content: "I've been using both RSI and MACD indicators for technical analysis, but I'm curious what others think about their effectiveness...",
    author: {
      id: 2,
      username: "TechAnalyst",
      avatar: "/api/placeholder/40/40"
    },
    likes: 32,
    comments: 18,
    views: 156,
    createdAt: "2024-01-15T09:15:00Z",
    category: "Technical Analysis",
    tags: ["RSI", "MACD", "technical-analysis"]
  },
  {
    id: 3,
    title: "Risk management rules every trader should follow",
    content: "After blowing up my account twice, I've learned the importance of proper risk management. Here are my top 5 rules...",
    author: {
      id: 3,
      username: "RiskManager",
      avatar: "/api/placeholder/40/40"
    },
    likes: 67,
    comments: 24,
    views: 412,
    createdAt: "2024-01-14T16:45:00Z",
    category: "Risk Management",
    tags: ["risk-management", "rules", "psychology"]
  },
  {
    id: 4,
    title: "How to deal with trading psychology issues?",
    content: "Lately I've been struggling with FOMO and revenge trading. How do you guys handle the psychological aspects of trading?",
    author: {
      id: 4,
      username: "NewTrader23",
      avatar: "/api/placeholder/40/40"
    },
    likes: 28,
    comments: 31,
    views: 189,
    createdAt: "2024-01-14T14:20:00Z",
    category: "Psychology",
    tags: ["psychology", "FOMO", "discipline"]
  }
]

export default function ForumPage() {
  const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest')
  const [posts] = useState(mockPosts)

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.likes - a.likes
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Forum</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSortBy('latest')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    sortBy === 'latest'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  For you
                </button>
                <button
                  onClick={() => setSortBy('trending')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    sortBy === 'trending'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Trending
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {sortedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-pink-300 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {post.author.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{post.author.username}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-pink-600 cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-pink-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-pink-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments}</span>
                        </button>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{post.views}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Post Button */}
          <div className="fixed bottom-6 right-6">
            <Link
              href="/forum/create"
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
