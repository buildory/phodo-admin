'use client'

import { useQuery } from '@tanstack/react-query'
import { UserListParams, UserListResponse } from '@/lib/data/users'

export const useUsers = (params: UserListParams = {}) => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
    search: params.search || '',
    role: params.role || '',
    status: params.status || ''
  }).toString()

  return useQuery<UserListResponse>({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await fetch(`/api/users?${queryString}`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  })
}

export const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      return response.json()
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}
