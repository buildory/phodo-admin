'use client'

import { useState } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { UserListResponse } from '@/lib/data/users'
import { UserTable } from './UserTable'
import { UserFilters } from './UserFilters'
import { Pagination } from '@/components/ui/pagination'

interface UserListProps {
  initialData: UserListResponse
}

export function UserList({ initialData }: UserListProps) {
  const [filters, setFilters] = useState({
    page: initialData.page,
    limit: initialData.limit,
    search: '',
    role: '',
    status: ''
  })

  const { data, isLoading, error } = useUsers(filters)

  const currentData = data || initialData

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">사용자 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <UserFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <UserTable 
        users={currentData.users}
        isLoading={isLoading}
      />
      
      <Pagination
        currentPage={currentData.page}
        totalPages={currentData.totalPages}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />
    </div>
  )
}