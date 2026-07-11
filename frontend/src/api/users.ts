import client from './client'
import type { User } from '../types'

export const getUser = (id: number) => client.get<User>(`/users/${id}`)

export const updateProfile = (data: FormData) =>
  client.put<User>('/users/me', data, { headers: { 'Content-Type': 'multipart/form-data' } })

export const follow = (id: number) => client.post(`/users/${id}/follow`)

export const unfollow = (id: number) => client.delete(`/users/${id}/follow`)

export const getFollowing = (id: number) => client.get<User[]>(`/users/${id}/following`)

export const getFollowers = (id: number) => client.get<User[]>(`/users/${id}/followers`)

export const searchUsers = (q: string) =>
  client.get<User[]>('/users/search', { params: { q } })

export const getSuggestions = () => client.get<User[]>('/users/suggestions')
