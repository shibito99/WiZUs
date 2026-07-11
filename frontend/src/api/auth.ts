import client from './client'
import type { AuthResponse } from '../types'

export const register = (username: string, email: string, password: string) =>
  client.post<AuthResponse>('/auth/register', { username, email, password })

export const login = (email: string, password: string) =>
  client.post<AuthResponse>('/auth/login', { email, password })
