import client from './client'
import type { Post, Comment, Page } from '../types'

export const getTimeline = (page = 0) =>
  client.get<Page<Post>>('/posts', { params: { page, size: 20 } })

export const getUserPosts = (userId: number, page = 0) =>
  client.get<Page<Post>>(`/users/${userId}/posts`, { params: { page, size: 20 } })

export const createPost = (data: FormData) =>
  client.post<Post>('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deletePost = (id: number) => client.delete(`/posts/${id}`)

export const likePost = (id: number) => client.post<{ likeCount: number }>(`/posts/${id}/likes`)

export const unlikePost = (id: number) => client.delete<{ likeCount: number }>(`/posts/${id}/likes`)

export const getComments = (postId: number) =>
  client.get<Comment[]>(`/posts/${postId}/comments`)

export const addComment = (postId: number, content: string) =>
  client.post<Comment>(`/posts/${postId}/comments`, { content })

export const addReply = (commentId: number, content: string) =>
  client.post<Comment>(`/comments/${commentId}/replies`, { content })

export const deleteComment = (id: number) => client.delete(`/comments/${id}`)
