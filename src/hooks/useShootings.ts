'use client'

import { useQuery } from '@tanstack/react-query'
import { ShootingListParams, ShootingListResponse } from '@/lib/data/shootings'

export const useShootings = (params: ShootingListParams = {}) => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
    search: params.search || '',
    state: params.state || '',
    recruit_type: params.recruit_type || ''
  }).toString()

  return useQuery<ShootingListResponse>({
    queryKey: ['shootings', params],
    queryFn: async () => {
      const response = await fetch(`/api/shootings?${queryString}`)
      if (!response.ok) {
        throw new Error('Failed to fetch shootings')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

export const useShooting = (shootingId: number | null) => {
  return useQuery({
    queryKey: ['shooting', shootingId],
    queryFn: async () => {
      const response = await fetch(`/api/shootings/${shootingId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch shooting')
      }
      return response.json()
    },
    enabled: !!shootingId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

