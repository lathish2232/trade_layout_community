'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URLS } from '@/config/api'
import HybridEditor from '@/components/community_feed/HybridEditor'

// Force recompilation
export default function CreateQueryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(API_URLS.CATEGORIES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Categories fetched from backend:', data)
          
          // Handle different response formats
          let categoriesData = []
          if (Array.isArray(data)) {
            categoriesData = data
          } else if (data.data && Array.isArray(data.data)) {
            categoriesData = data.data
          } else if (data.results && Array.isArray(data.results)) {
            categoriesData = data.results
          }
          
          // Add styling to categories if not present
          const categoriesWithStyling = categoriesData.map((cat: any, index: number) => {
            const colorSchemes = [
              { color: 'bg-gradient-to-r from-purple-500 to-pink-500', borderColor: 'border-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
              { color: 'bg-gradient-to-r from-blue-500 to-cyan-500', borderColor: 'border-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
              { color: 'bg-gradient-to-r from-green-500 to-emerald-500', borderColor: 'border-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
              { color: 'bg-gradient-to-r from-orange-500 to-red-500', borderColor: 'border-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
              { color: 'bg-gradient-to-r from-teal-500 to-green-500', borderColor: 'border-teal-500', textColor: 'text-teal-700', bgLight: 'bg-teal-50' },
              { color: 'bg-gradient-to-r from-red-500 to-orange-500', borderColor: 'border-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
            ]
            
            return {
              ...cat,
              color: colorSchemes[index % colorSchemes.length].color,
              borderColor: colorSchemes[index % colorSchemes.length].borderColor,
              textColor: colorSchemes[index % colorSchemes.length].textColor,
              bgLight: colorSchemes[index % colorSchemes.length].bgLight,
            }
          })
          
          setCategories(categoriesWithStyling)
          setApiError(null)
        } else {
          console.error('Failed to fetch categories:', response.status)
          setApiError('Failed to connect to server. Using offline mode.')
          
          // Fallback to hardcoded categories if API fails
          const fallbackCategories = [
            { name: 'Trading Strategies', color: 'bg-gradient-to-r from-purple-500 to-pink-500', borderColor: 'border-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50', id: 1 },
            { name: 'Platform Usage', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', borderColor: 'border-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', id: 2 },
            { name: 'Subscription and Pricing', color: 'bg-gradient-to-r from-green-500 to-emerald-500', borderColor: 'border-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50', id: 3 },
            { name: 'Broker Connectivity', color: 'bg-gradient-to-r from-orange-500 to-red-500', borderColor: 'border-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', id: 4 },
            { name: 'Backtesting', color: 'bg-gradient-to-r from-teal-500 to-green-500', borderColor: 'border-teal-500', textColor: 'text-teal-700', bgLight: 'bg-teal-50', id: 5 },
            { name: 'Live Trading', color: 'bg-gradient-to-r from-red-500 to-orange-500', borderColor: 'border-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', id: 6 },
            { name: 'Risk Management', color: 'bg-gradient-to-r from-amber-500 to-yellow-500', borderColor: 'border-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', id: 7 },
            { name: 'Report a Bug or Error', color: 'bg-gradient-to-r from-gray-500 to-slate-500', borderColor: 'border-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-50', id: 8 },
            { name: 'General', color: 'bg-gradient-to-r from-indigo-500 to-purple-500', borderColor: 'border-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50', id: 9 }
          ]
          setCategories(fallbackCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setApiError('Unable to connect to server. Please check your internet connection.')
        
        // Set fallback categories on error
        const fallbackCategories = [
          { name: 'General', color: 'bg-gradient-to-r from-indigo-500 to-purple-500', borderColor: 'border-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50', id: 1 }
        ]
        setCategories(fallbackCategories)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    if (!category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size should be less than 10MB')
      return
    }

    setUploadedFiles(prev => [...prev, file])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted - preventing default behavior')
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Get authentication token
      const token = localStorage.getItem('token')
      
      // Find selected category object
      const selectedCategory = categories.find(cat => cat.name === category)
      const categoryId = selectedCategory?.id || 1
      
      // Create FormData for file uploads
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('query_type', 'QUESTION')
      formData.append('category_id', categoryId.toString())
      
      // Add uploaded files to form data
      uploadedFiles.forEach((file) => {
        formData.append('files', file)
      })
      
      const response = await fetch(API_URLS.QUERY_CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Query created successfully:', data)
        
        // Show success modal
        setShowSuccessModal(true)
      } else {
        const errorData = await response.json()
        console.error('Failed to create query:', errorData)
        
        // Show specific error messages based on status code
        let errorMessage = 'Failed to create query'
        if (response.status === 0) {
          errorMessage = 'Network connection failed. Please check your internet connection.'
        } else if (response.status === 400) {
          errorMessage = errorData.error || 'Invalid data provided. Please check your input.'
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.'
        } else if (response.status === 403) {
          errorMessage = 'Permission denied. You do not have access to create queries.'
        } else if (response.status === 404) {
          errorMessage = 'API endpoint not found. Please contact support.'
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait and try again.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
        
        // Handle error (show error message to user)
        setErrors({ general: errorMessage })
      }
    } catch (error) {
      console.error('Error creating query:', error)
      
      // Show specific error messages for different types of errors
      let errorMessage = 'Network error. Please try again.'
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network connection failed. Please check your internet connection.'
      } else if (error instanceof TypeError && error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Server is not responding. Please try again later.'
      } else if (error instanceof TypeError && error.message.includes('ERR_INTERNET_DISCONNECTED')) {
        errorMessage = 'Internet connection lost. Please check your network.'
      } else if (error instanceof TypeError && error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.'
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* API Error Notification */}
          {apiError && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Connection Issue</h4>
                  <p className="text-sm text-yellow-700 mt-1">{apiError}</p>
                  <p className="text-xs text-yellow-600 mt-2">You can continue creating queries, but some features may be limited.</p>
                </div>
              </div>
            </div>
          )}

          {/* General Error Notification */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                  <p className="text-xs text-red-600 mt-2">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading query form...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 transition-all duration-500 ease-out ${isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
      {/* API Error Notification */}
      {apiError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h.638a9 9 0 0118.938-4 4a9 9 0 0118-938-4 4" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Connection Issue</h4>
              <p className="text-sm text-yellow-700 mt-1">{apiError}</p>
              <p className="text-xs text-yellow-600 mt-2">You can continue creating queries, but some features may be limited.</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Query Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a clear and descriptive title for your query"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-sm font-medium transform hover:scale-105 hover:shadow-lg ${
                  category === cat.name
                    ? `${cat.borderColor} ${cat.bgLight} ${cat.textColor} border-2 shadow-md`
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-4 h-4 rounded-full ${cat.color} animate-pulse flex-shrink-0`}
                    ></div>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-1 ml-7">{cat.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Query Details *
          </label>
          
          {/* Video Upload Note */}
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Video Upload:</span> Platform doesn&apos;t support video uploads. Share videos via Google Drive or YouTube with public access links.
              </p>
            </div>
          </div>

          <HybridEditor
            value={content}
            onChange={setContent}
            placeholder="Provide detailed information about your query. Include context, what you&apos;ve tried, and what specific help you need from community."
            minHeight="300px"
          />
          
          {/* File Upload - Completely separate from editor */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Files (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => document.getElementById('query-file-upload')?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
              >
                <span>📎</span>
                <span>Choose File</span>
              </button>
              <input
                id="query-file-upload"
                type="file"
                accept="*/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploadedFiles.length > 0 && (
                <span className="text-sm text-gray-600">
                  {uploadedFiles.length} file(s) selected
                </span>
              )}
            </div>
            
            {/* Show uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md text-sm font-medium transition-all duration-200 shadow-lg ${
              isSubmitting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/50 hover:shadow-pink-500/70'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Query...
              </div>
            ) : (
              'submit'
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Query Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6">Your query has been created and is now visible in the query section.</p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/query')
                }}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-md font-medium transition-colors"
              >
                Go to Queries
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
