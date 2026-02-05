'use client'

import AuthGuard from '@/components/AuthGuard'
import { useState } from 'react'
import Link from 'next/link'

export default function QueryPage() {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  
  const queries = [
    {
      id: 1,
      title: 'How do I get started with trading as a complete beginner?',
      category: { name: 'Beginner', color: 'green' },
      author: 'New Trader',
      replies: 12,
      views: 89,
      time: '1 hour ago',
      solved: true
    },
    {
      id: 2,
      title: 'What are the best day trading strategies for volatile markets?',
      category: { name: 'Trading Strategies', color: 'blue' },
      author: 'Pro Trader',
      replies: 18,
      views: 156,
      time: '3 hours ago',
      solved: false
    },
    {
      id: 3,
      title: 'Which pricing plan offers the best value for frequent traders?',
      category: { name: 'Plans and Pricing', color: 'purple' },
      author: 'Budget User',
      replies: 8,
      views: 67,
      time: '5 hours ago',
      solved: true
    },
    {
      id: 4,
      title: 'Chart loading error on mobile devices',
      category: { name: 'Report a bug or error', color: 'red' },
      author: 'Tech User',
      replies: 5,
      views: 34,
      time: '7 hours ago',
      solved: true
    },
    {
      id: 5,
      title: 'What risk management strategies should every beginner know?',
      category: { name: 'Beginner', color: 'green' },
      author: 'Cautious Trader',
      replies: 24,
      views: 201,
      time: '1 day ago',
      solved: true
    }
  ]

  const sortedQueries = [...queries].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.replies - a.replies
      case 'latest':
      default:
        return 0 // Keep original order (already sorted by time)
    }
  })

  return (
    // <AuthGuard>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Trading Queries</h1>
            <Link
              href="/query/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 transition-all duration-200 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
            >
              Create Query
            </Link>
          </div>

          {/* Sort Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                sortBy === 'latest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                sortBy === 'popular'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Popular
            </button>
          </div>
        </div>

        {/* Queries List */}
        <div className="space-y-4">
          {sortedQueries.map((query) => (
            <div key={query.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link href={`/query/${query.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors mb-2">
                      {query.title}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 bg-${query.category.color}-100 text-${query.category.color}-700 rounded-full text-xs font-medium flex items-center space-x-1`}>
                      <div 
                        className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px]"
                        style={{ borderLeftColor: query.category.color === 'green' ? '#10b981' : query.category.color === 'blue' ? '#3b82f6' : query.category.color === 'purple' ? '#8b5cf6' : '#ef4444' }}
                      ></div>
                      <span>{query.category.name}</span>
                    </span>
                    <span>by {query.author}</span>
                    <span>{query.time}</span>
                    {query.solved && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ✓ Solved
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-6">
                  <span>{query.replies} replies</span>
                  <span>{query.views} views</span>
                </div>
                <Link 
                  href={`/query/${query.id}`}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  View Query →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {queries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No queries yet</h3>
            <p className="text-gray-600 mb-4">Be the first to ask a trading question!</p>
            <Link
              href="/query/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 transition-all duration-200 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
            >
              Create Query
            </Link>
          </div>
        )}
      </div>
    // </AuthGuard>
  )
}
