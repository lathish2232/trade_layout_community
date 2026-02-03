'use client'

import { formatDistanceToNow } from 'date-fns'
import { Reply } from '@/lib/api/forum'
import VoteButtons from './VoteButtons'
import UserAvatar from './UserAvatar'
import MarkdownRenderer from './MarkdownRenderer'

interface ReplyCardProps {
  reply: Reply
  isNested?: boolean
  onReply?: (parentId: string) => void
}

export default function ReplyCard({ reply, isNested = false, onReply }: ReplyCardProps) {
  const timeAgo = formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })
  
  return (
    <div className={`${isNested ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <UserAvatar username={reply.author.username} avatar={reply.author.avatar} size="md" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">{reply.author.username}</span>
              <span className="text-sm text-gray-500">{timeAgo}</span>
              {reply.updatedAt !== reply.createdAt && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700">
              <MarkdownRenderer content={reply.content} />
            </div>
            
            <div className="mt-3 flex items-center space-x-4">
              <VoteButtons
                type="reply"
                id={reply.id}
                votes={reply.votes}
                userVote={reply.userVote}
                size="sm"
              />
              
              {!isNested && onReply && (
                <button
                  onClick={() => onReply(reply.id)}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
