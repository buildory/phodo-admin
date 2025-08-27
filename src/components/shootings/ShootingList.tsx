'use client'

import { useState } from 'react'
import { useShootings } from '@/hooks/useShootings'
import { ShootingListResponse, ShootingListParams } from '@/lib/data/shootings'
import { ShootingTable } from './ShootingTable'
import { ShootingFilters } from './ShootingFilters'
import { Pagination } from '@/components/ui/pagination'

interface ShootingListProps {
  initialData: ShootingListResponse
}

export function ShootingList({ initialData }: ShootingListProps) {
  const [filters, setFilters] = useState<ShootingListParams>({
    page: initialData.page,
    limit: initialData.limit,
    search: '',
    state: '',
    recruit_type: ''
  })

  const { data, isLoading, error } = useShootings(filters)

  const currentData: ShootingListResponse = data || initialData

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">촬영 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ShootingFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <ShootingTable 
        shootings={currentData.shootings}
        isLoading={isLoading}
      />
      
      {currentData.totalPages > 1 && (
        <Pagination
          currentPage={currentData.page}
          totalPages={currentData.totalPages}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        />
      )}
    </div>
  )
}
