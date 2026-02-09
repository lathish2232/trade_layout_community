"use client"

import AuthGuard from '@/components/AuthGuard'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API_URLS } from '@/config/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBookOpen, 
  faPlug, 
  faChartLine, 
  faBolt, 
  faCode, 
  faCogs, 
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons'

// Icon mapping from backend API icon names to FontAwesome icons
const iconMap: { [key: string]: any } = {
  'book-open': faBookOpen,
  'plug': faPlug,
  'chart-line': faChartLine,
  'activity': faBolt, // Using faBolt as alternative to faActivity
  'code': faCode,
  'cogs': faCogs,
  'question-circle': faQuestionCircle,
}

interface Query {
  id: string
  title: string
  summary: string
  views_count: number
  upvotes: number
  downvotes: number
  created_at: string
  user: {
    user_id: string
    display_name: string
    avatar_url: string
  }
  category: {
    id: number
    name: string
    slug: string
    description: string
    icon: string
    color: string
    is_active: boolean
  }
  tags: any[]
  query_type: string
  has_accepted_answer: boolean
  answer_count: number
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Query[]
}

export default function QueryPage() {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false
  })

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('token')
        const params = new URLSearchParams({
          page: '1',
          limit: '10',
          sort: sortBy === 'latest' ? 'created_at' : 'likes_count'
        })

        const response = await fetch(`${API_URLS.QUERIES_LIST}?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data: ApiResponse = await response.json()
          setQueries(data.results)
          setPagination({
            current_page: 1,
            total_pages: Math.ceil(data.count / 10),
            total_items: data.count,
            has_next: data.next !== null,
            has_prev: data.previous !== null
          })
        } else {
          setError('Failed to connect to server')
        }
      } catch (err) {
        console.error('Error fetching queries:', err)
        setError('Unable to load queries. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchQueries()
  }, [sortBy])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  return (
    // <AuthGuard>
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            Trading Queries
          </h1>
          <Link
            href="/query/create"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 shadow"
          >
            Create Query
          </Link>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-4 py-2 text-sm rounded-md ${
              sortBy === 'latest'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 text-sm rounded-md ${
              sortBy === 'popular'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : queries.length === 0 ? (
          <p className="text-center">No queries found.</p>
        ) : (
          queries.map(query => (
            <div key={query.id} className="bg-white border p-4 rounded-lg">
              <div className="mb-2">
                <Link href={`/query/${query.id}`}>
                  <h3 className="text-lg font-semibold hover:text-blue-500">
                    {query.title}
                  </h3>
                </Link>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                by {query.user.display_name} • {formatTimeAgo(query.created_at)}
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="space-x-4 text-sm text-gray-500">
                  <span>{query.answer_count} replies</span>
                  <span>{query.views_count} views</span>
                  <span>{query.upvotes} likes</span>
                </div>
              </div>

              <div className="mb-3">
                <span className={`inline-flex px-2 py-1 bg-${query.category.color}-100 text-${query.category.color}-700 rounded-full text-xs font-medium items-center space-x-1`}>
                  <FontAwesomeIcon 
                    icon={iconMap[query.category.icon] || faQuestionCircle} 
                    className="w-3 h-3"
                  />
                  <span>{query.category.name}</span>
                </span>
              </div>

              <div className="flex justify-end">
                <Link
                  href={`/query/${query.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    // </AuthGuard>
  )
}
