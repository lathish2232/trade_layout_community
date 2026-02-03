'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Post } from '@/lib/api/forum'
import UserAvatar from './UserAvatar'
import LikeButton from '@/components/forum/LikeButton'
import ReplyButton from '@/components/forum/ReplyButton'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
  
  const processContent = (content: string) => {
    // Process mentions
    let processedContent = content.replace(/@(\w+)/g, '<span class="text-blue-500 hover:underline cursor-pointer">@$1</span>')
    
    // Process hashtags
    processedContent = processedContent.replace(/#(\w+)/g, '<span class="text-blue-500 hover:underline cursor-pointer">#$1</span>')
    
    return processedContent
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <UserAvatar user={post.author} size="md" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <Link href={`/profile/${post.author.username}`} className="hover:underline">
              <span className="font-medium text-gray-900">{post.author.name}</span>
            </Link>
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
            <span className="text-gray-500">{timeAgo}</span>
          </div>
          
          <div className="mt-2">
            <div 
              className="text-gray-900 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
            />
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
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ReplyButton 
                postId={post.id}
                replyCount={post.replies.length}
              />
              <LikeButton 
                postId={post.id}
                likeCount={post.likes}
                userLike={post.userLike}
              />
            </div>
            
            <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="Share">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m9.032 4.026A9.001 9.001 0 012.968 7.326" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
