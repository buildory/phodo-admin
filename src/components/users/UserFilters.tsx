'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, X } from 'lucide-react'
import { UserListParams } from '@/lib/data/users'

interface UserFiltersProps {
  filters: UserListParams
  onFiltersChange: (filters: UserListParams) => void
}

export function UserFilters({ filters, onFiltersChange }: UserFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '')

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      search: searchValue,
      page: 1 // 검색 시 첫 페이지로 이동
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setSearchValue('')
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      search: '',
      role: '',
      status: ''
    })
  }

  const hasActiveFilters = filters.search || filters.role || filters.status

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="사용자 검색..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        검색
      </Button>
      
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        필터
      </Button>
      
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          필터 초기화
        </Button>
      )}
    </div>
  )
}

