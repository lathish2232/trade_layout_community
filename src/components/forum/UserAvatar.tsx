'use client'

import Image from 'next/image'
import { User } from '@/lib/api/forum'

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
}

export default function UserAvatar({ user, size = 'sm' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}>
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}
