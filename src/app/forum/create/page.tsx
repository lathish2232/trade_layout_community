'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePost } from '@/lib/api/forum'
import HybridEditor from '@/components/forum/HybridEditor'

export default function CreatePostPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createPostMutation = useCreatePost()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!content.trim()) {
      newErrors.content = 'Content is required'
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await createPostMutation.mutate({
        content: content.trim(),
        tags: [],
        mentions: []
      })
      
      router.push('/forum')
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
        <p className="text-gray-600 mt-1">Share your thoughts with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <HybridEditor
            value={content}
            onChange={setContent}
            placeholder="What's happening? Share your trading insights, strategies, or market updates..."
            minHeight="200px"
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
            disabled={createPostMutation.loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-all duration-200"
          >
            {createPostMutation.loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
