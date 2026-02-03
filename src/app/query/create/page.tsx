'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import HybridEditor from '@/components/forum/HybridEditor'

export default function CreateQueryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { name: 'Beginner', color: 'green' },
    { name: 'Trading Strategies', color: 'blue' },
    { name: 'Plans and Pricing', color: 'purple' },
    { name: 'Report a bug or error', color: 'red' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters'
    }
    
    if (!category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Simulate API call
    setTimeout(() => {
      router.push('/query')
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Query</h1>
        <p className="text-gray-600 mt-1">Ask the community for trading insights and advice</p>
      </div>

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`p-3 rounded-md border-2 transition-all duration-200 text-sm ${
                  category === cat.name
                    ? `border-${cat.color}-500 bg-${cat.color}-50 text-${cat.color}-700`
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[8px]"
                    style={{ borderLeftColor: cat.color === 'green' ? '#10b981' : cat.color === 'blue' ? '#3b82f6' : cat.color === 'purple' ? '#8b5cf6' : '#ef4444' }}
                  ></div>
                  <span>{cat.name}</span>
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
          <HybridEditor
            value={content}
            onChange={setContent}
            placeholder="Provide detailed information about your query. Include context, what you've tried, and what specific help you need from the community."
            minHeight="300px"
          />
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
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-md text-sm font-medium transition-all duration-200 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70"
          >
            Create Query
          </button>
        </div>
      </form>
    </div>
  )
}
