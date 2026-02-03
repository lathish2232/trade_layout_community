'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Topic } from '@/lib/api/forum'
import VoteButtons from './VoteButtons'
import CategoryBadge from './CategoryBadge'

interface TopicCardProps {
  topic: Topic
}

export default function TopicCard({ topic }: TopicCardProps) {
  const timeAgo = formatDistanceToNow(new Date(topic.lastActivity), { addSuffix: true })
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <VoteButtons
            type="topic"
            id={topic.id}
            votes={topic.votes}
            userVote={topic.userVote}
            size="sm"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {topic.pinned && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  📌 Pinned
                </span>
              )}
              {topic.locked && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  🔒 Locked
                </span>
              )}
              <CategoryBadge category={topic.category} />
            </div>
            
            <Link href={`/forum/topic/${topic.id}`} className="block">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 transition-colors duration-200 hover:text-indigo-600 line-clamp-2">
                {topic.title}
              </h3>
            </Link>
            
            <p className="mt-1 text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
              {topic.content}
            </p>
            
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>
                  by <span className="font-medium text-gray-700">{topic.author.username}</span>
                </span>
                <span>{topic.replyCount} replies</span>
              </div>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
