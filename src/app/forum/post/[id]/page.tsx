'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { usePost, useCreateReply } from '@/lib/api/forum'
import UserAvatar from '@/components/forum/UserAvatar'
import LikeButton from '@/components/forum/LikeButton'
import ReplyButton from '@/components/forum/ReplyButton'
import MarkdownRenderer from '@/components/forum/MarkdownRenderer'

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [replyContent, setReplyContent] = useState('')
  
  const { post, replies, loading, error } = usePost(postId)
  const createReplyMutation = useCreateReply()

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !post) return

    try {
      await createReplyMutation.mutate({
        postId: post.id,
        content: replyContent.trim(),
        tags: [],
        mentions: []
      })
      setReplyContent('')
    } catch (error) {
      console.error('Failed to create reply:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Post */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <UserAvatar user={post.author} size="lg" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <span className="font-medium text-gray-900">{post.author.name}</span>
              {post.author.verified && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {post.author.isAdmin && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  Admin
                </span>
              )}
              <span className="text-gray-500">@{post.author.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="mt-2">
              <MarkdownRenderer content={post.content} />
            </div>
            
            {post.images && post.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {post.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ReplyButton 
                  postId={post.id} 
                  replyCount={replies.length}
                />
                <LikeButton 
                  postId={post.id}
                  likeCount={post.likes}
                  userLike={post.userLike}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <form onSubmit={handleReplySubmit}>
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Post your reply"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!replyContent.trim() || createReplyMutation.loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {createReplyMutation.loading ? 'Replying...' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Replies */}
      <div className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <UserAvatar user={reply.author} size="md" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-900">{reply.author.name}</span>
                  {reply.author.verified && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {reply.author.isAdmin && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      Admin
                    </span>
                  )}
                  <span className="text-gray-500">@{reply.author.username}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-2">
                  <MarkdownRenderer content={reply.content} />
                </div>
                
                <div className="mt-2 flex items-center space-x-4">
                  <LikeButton 
                    postId={reply.id}
                    likeCount={reply.likes}
                    userLike={reply.userLike}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
