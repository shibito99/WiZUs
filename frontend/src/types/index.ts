export interface User {
  id: number
  username: string
  email: string
  avatarUrl: string | null
  bio: string | null
  followingCount: number
  followerCount: number
  createdAt: string
}

export interface Post {
  id: number
  userId: number
  username: string
  avatarUrl: string | null
  content: string
  imageUrl: string | null
  likeCount: number
  commentCount: number
  likedByMe: boolean
  createdAt: string
}

export interface Comment {
  id: number
  userId: number
  username: string
  avatarUrl: string | null
  content: string
  replies: Comment[]
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
}
