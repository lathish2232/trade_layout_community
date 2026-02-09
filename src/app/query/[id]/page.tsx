"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { API_URLS } from '@/config/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faThumbsUp, faBookOpen, faPlug, faChartLine, faBolt, faCode, faCogs, faQuestionCircle, faReply } from '@fortawesome/free-solid-svg-icons'

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

interface QueryDetail {
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
  content?: string
}

export default function QueryDetailPage() {
  const params = useParams()
  const [query, setQuery] = useState<QueryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const fetchCountRef = useRef(0)
  const [showReplyEditor, setShowReplyEditor] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    const fetchQueryDetail = async () => {
      try {
        console.log(`🔄 Fetching query detail for ID: ${params.id}, fetch count: ${fetchCountRef.current}`)
        fetchCountRef.current += 1
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('token')
        const queryId = params.id as string
        
        const response = await fetch(`${API_URLS.QUERIES_LIST}${queryId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data: QueryDetail = await response.json()
          console.log('✅ Query data received:', data)
          setQuery(data)
          setHasFetched(true)
        } else {
          setError('Failed to load query details')
        }
      } catch (err) {
        console.error('Error fetching query detail:', err)
        setError('Unable to load query details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id && !hasFetched && fetchCountRef.current === 0) {
      console.log('🚀 Starting first fetch for:', params.id)
      fetchQueryDetail()
    } else {
      console.log(`⏭ Skipping fetch - hasFetched: ${hasFetched}, fetchCount: ${fetchCountRef.current}`)
    }
  }, [params.id, hasFetched])

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          href="/query"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          ← Back to Queries
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading query...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      ) : query ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{query.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className={`px-3 py-1 bg-${query.category.color}-100 text-${query.category.color}-700 rounded-full text-xs font-medium flex items-center space-x-2`}>
                <FontAwesomeIcon 
                  icon={iconMap[query.category.icon] || faQuestionCircle} 
                  className="w-3 h-3"
                />
                <span>{query.category.name}</span>
              </span>
              <span>by {query.user.display_name}</span>
              <span>{formatTimeAgo(query.created_at)}</span>
              {query.has_accepted_answer && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  ✓ Solved
                </span>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <span>{query.answer_count} replies</span>
              <span>{query.views_count} views</span>
              <span>{query.upvotes} likes</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: (query.summary || query.content || 'No content available')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/<div><br><\/div>/g, '<br>')
                  .replace(/<\/div><div>/g, '</div><br><div>')
              }}
            />
          </div>

          {/* Reply Editor */}
          {showReplyEditor && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Type your reply here..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReplyEditor(false)
                    setReplyText('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement reply submission
                    console.log('Reply submitted:', replyText)
                    alert('Reply functionality will be implemented soon!')
                    setShowReplyEditor(false)
                    setReplyText('')
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit Reply
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 rounded-md hover:bg-gray-100">
                  <FontAwesomeIcon 
                    icon={faThumbsUp} 
                    shake 
                    style={{color: "#d51abc"}} 
                  /> ({query.upvotes})
                </button>
                <button className="px-4 py-2 rounded-md hover:bg-gray-100">
                  <FontAwesomeIcon 
                    icon={faThumbsDown} 
                    shake 
                    style={{color: "#dc18cc"}} 
                  /> ({query.downvotes})
                </button>
                <button 
                  className="px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowReplyEditor(!showReplyEditor)}
                >
                  <FontAwesomeIcon 
                    icon={faReply} 
                    style={{color: "#e12bee"}} 
                  /> Post your reply
                </button>
              </div>
              <Link
                href="/query/create"
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Query not found.</p>
        </div>
      )}
    </div>
  )
}
