'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HybridEditor from '@/components/community_feed/HybridEditor'

export default function CreateDiscussionPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addPoll, setAddPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState(['', ''])

  const categories = [
    { name: 'Trading Ideas', color: 'bg-gradient-to-r from-purple-500 to-pink-500', borderColor: 'border-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
    { name: 'Strategies', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', borderColor: 'border-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
    { name: 'Market View', color: 'bg-gradient-to-r from-green-500 to-emerald-500', borderColor: 'border-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    { name: 'Tools & Indicators', color: 'bg-gradient-to-r from-orange-500 to-red-500', borderColor: 'border-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
    { name: 'General Discussion', color: 'bg-gradient-to-r from-indigo-500 to-purple-500', borderColor: 'border-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50' }
  ]

  useEffect(() => {
    // Simulate page loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

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
    
    if (addPoll) {
      const validOptions = pollOptions.filter(option => option.trim())
      if (validOptions.length < 2) {
        newErrors.poll = 'Poll must have at least 2 options'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ''])
    }
  }

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index))
    }
  }

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions]
    newOptions[index] = value
    setPollOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      router.push('/forum')
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading discussion form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 transition-all duration-500 ease-out ${isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Discussion</h1>
        <p className="text-gray-600 mt-1">Start an open conversation and share ideas with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Discussion Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a clear discussion topic"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Topic Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Category *
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
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${cat.color} animate-pulse`}
                  ></div>
                  <span className="text-left">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800 border border-pink-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-pink-600 hover:text-pink-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add tags (max 5)"
              disabled={tags.length >= 5}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 5}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {tags.length}/5 tags added
          </p>
        </div>

        {/* Discussion Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Discussion Content *
          </label>
          
          {/* Helper Note */}
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-800">
                <span className="font-medium">Tip:</span> Share your idea or question clearly so others can respond effectively
              </p>
            </div>
          </div>

          <HybridEditor
            value={content}
            onChange={setContent}
            placeholder="Share your thoughts, ideas, or questions to start a meaningful discussion with the community."
            minHeight="300px"
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Poll Option */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="addPoll"
              checked={addPoll}
              onChange={(e) => setAddPoll(e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="addPoll" className="text-sm font-medium text-gray-700">
              Add simple poll
            </label>
          </div>

          {addPoll && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Add poll options (2-5 options):</p>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  + Add Option
                </button>
              )}
              {errors.poll && (
                <p className="mt-2 text-sm text-red-600">{errors.poll}</p>
              )}
            </div>
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
                Posting Discussion...
              </div>
            ) : (
              'Post Discussion'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
