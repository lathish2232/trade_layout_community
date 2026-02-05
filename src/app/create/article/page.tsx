'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import HybridEditor from '@/components/community_feed/HybridEditor'

export default function CreateArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isDraft, setIsDraft] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const categories = [
    { name: 'Tutorial', color: 'bg-gradient-to-r from-blue-500 to-indigo-500', borderColor: 'border-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
    { name: 'Strategy Guide', color: 'bg-gradient-to-r from-purple-500 to-pink-500', borderColor: 'border-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-50' },
    { name: 'Market Analysis', color: 'bg-gradient-to-r from-green-500 to-emerald-500', borderColor: 'border-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    { name: 'Platform Guide', color: 'bg-gradient-to-r from-orange-500 to-red-500', borderColor: 'border-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
    { name: 'Research', color: 'bg-gradient-to-r from-teal-500 to-cyan-500', borderColor: 'border-teal-500', textColor: 'text-teal-700', bgLight: 'bg-teal-50' },
    { name: 'Case Study', color: 'bg-gradient-to-r from-amber-500 to-yellow-500', borderColor: 'border-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' }
  ]

  useEffect(() => {
    // Simulate page loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Calculate estimated read time (200 words per minute)
  const calculateReadTime = () => {
    if (!content.trim()) return '0 min'
    const wordCount = content.trim().split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)
    return `${readTime} min read`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters'
    }
    
    if (!category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 8 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleImageUpload(files[0])
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    setIsDraft(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Show success message or redirect
    }, 1000)
  }

  const handlePreview = () => {
    // Navigate to preview page or open modal
    console.log('Preview article')
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
          <p className="text-gray-600 text-lg">Loading article form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 transition-all duration-500 ease-out ${isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Article</h1>
            <p className="text-gray-600 mt-1">Publish a detailed guide, analysis, or research article</p>
          </div>
          {isDraft && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-300">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Draft
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Article Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a descriptive article title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Article Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Category *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

        {/* Cover Image */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image (optional)
          </label>
          
          {coverImage ? (
            <div className="relative">
              <img 
                src={coverImage} 
                alt="Cover image preview" 
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">
                {isDragging ? 'Drop image here' : 'Drag and drop image here, or click to browse'}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Choose File
              </label>
            </div>
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
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
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
              placeholder="Add tags (max 8)"
              disabled={tags.length >= 8}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 8}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {tags.length}/8 tags added
          </p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Article Content *
          </label>
          
          {/* Helper Note */}
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800">
                <span className="font-medium">Tip:</span> Write structured content with headings and examples for better readability
              </p>
            </div>
          </div>

          <HybridEditor
            value={content}
            onChange={setContent}
            placeholder="Write your comprehensive article here. Use headings, lists, images, and code blocks to make your content engaging and informative."
            minHeight="500px"
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Estimated Read Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Estimated Read Time
            </label>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600 font-medium">
                {calculateReadTime()}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all duration-200 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 border border-purple-300 rounded-md text-purple-700 hover:bg-purple-50 text-sm font-medium transition-all duration-200"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-md text-sm font-medium transition-all duration-200 shadow-lg ${
              isSubmitting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/50 hover:shadow-pink-500/70'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center px-6 py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publishing...
              </div>
            ) : (
              <div className="px-6 py-2">Publish Article</div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
