// Mock API hooks for forum functionality

// Types
export interface User {
  id: string
  username: string
  avatar?: string
  name: string
  verified?: boolean
  isAdmin?: boolean
}

export interface Post {
  id: string
  content: string
  author: User
  createdAt: Date
  likes: number
  userLike: boolean
  replies: number
  retweets: number
  userRetweet: boolean
  tags: string[]
  mentions: string[]
  images?: string[]
}

export interface Reply {
  id: string
  content: string
  author: User
  postId: string
  createdAt: Date
  likes: number
  userLike: boolean
  tags: string[]
  mentions: string[]
  images?: string[]
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'trader_joe',
    avatar: 'https://picsum.photos/seed/user1/40/40.jpg',
    name: 'Joe Trader',
    verified: true,
    isAdmin: false
  },
  {
    id: '2',
    username: 'admin',
    avatar: 'https://picsum.photos/seed/admin/40/40.jpg',
    name: 'Admin',
    verified: true,
    isAdmin: true
  },
  {
    id: '3',
    username: 'crypto_king',
    avatar: 'https://picsum.photos/seed/user3/40/40.jpg',
    name: 'Crypto King',
    verified: false,
    isAdmin: false
  },
  {
    id: '4',
    username: 'market_guru',
    avatar: 'https://picsum.photos/seed/user4/40/40.jpg',
    name: 'Market Guru',
    verified: true,
    isAdmin: false
  }
]

const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just hit my profit target on $BTC! 🚀 Thanks everyone for the support. @admin @trader_joe',
    author: mockUsers[2],
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    likes: 42,
    userLike: false,
    replies: 8,
    retweets: 12,
    userRetweet: false,
    tags: ['profit', 'bitcoin', 'trading'],
    mentions: ['admin', 'trader_joe']
  },
  {
    id: '2',
    content: 'New trading strategy alert! Check out this setup I\'ve been working on. What do you think @market_guru?',
    author: mockUsers[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    likes: 28,
    userLike: true,
    replies: 15,
    retweets: 6,
    userRetweet: false,
    tags: ['strategy', 'analysis'],
    mentions: ['market_guru']
  },
  {
    id: '3',
    content: 'Market update: All systems green today. Great trading conditions! 📈',
    author: mockUsers[3],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 156,
    userLike: false,
    replies: 23,
    retweets: 45,
    userRetweet: true,
    tags: ['market', 'update'],
    mentions: []
  }
]

const mockReplies: Reply[] = [
  {
    id: '1',
    content: 'Great job! Keep it up! 🎯',
    author: mockUsers[1],
    postId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 2),
    likes: 5,
    userLike: false,
    tags: ['congratulations'],
    mentions: []
  },
  {
    id: '2',
    content: 'Thanks for sharing! Looking forward to more updates @trader_joe',
    author: mockUsers[3],
    postId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    likes: 8,
    userLike: true,
    tags: [],
    mentions: ['trader_joe']
  }
]

// Mock API hooks
export function usePosts() {
  return {
    posts: mockPosts,
    loading: false,
    error: null,
    refetch: () => {}
  }
}

export function usePost(id: string) {
  const post = mockPosts.find(p => p.id === id)
  const replies = mockReplies.filter(r => r.postId === id)
  
  return {
    post: post || null,
    replies,
    loading: false,
    error: null,
    refetch: () => {}
  }
}

export function useUser(username: string) {
  const user = mockUsers.find(u => u.username === username)
  
  return {
    user: user || null,
    loading: false,
    error: null
  }
}

export function useCreatePost() {
  const mutation = {
    loading: false,
    error: null,
    mutate: async (data: { content: string; tags: string[]; mentions: string[] }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id: Date.now().toString() }
    }
  }
  
  return mutation
}

export const useCreateTopicMutation = () => {
  return {
    mutate: async (data: { title: string; content: string; category: string; tags: string[] }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true, topicId: 'new-topic-id' }
    },
    loading: false,
  }
}

export function useCreateReply() {
  const mutation = {
    loading: false,
    error: null,
    mutate: async (data: { postId: string; content: string; tags: string[]; mentions: string[] }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id: Date.now().toString() }
    }
  }
  
  return mutation
}

export const useCreateReplyMutation = () => {
  return {
    mutate: async (data: { content: string; topicId: string; parentId?: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true, replyId: 'new-reply-id' }
    },
    loading: false,
  }
}
