'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { ShootingListParams } from '@/lib/data/shootings'

interface ShootingFiltersProps {
  filters: ShootingListParams
  onFiltersChange: (filters: ShootingListParams) => void
}

export function ShootingFilters({ filters, onFiltersChange }: ShootingFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value, page: 1 })
  }

  const handleStateChange = (value: string) => {
    const stateValue = value === 'all' ? '' : value
    onFiltersChange({ ...filters, state: stateValue, page: 1 })
  }

  const handleRecruitTypeChange = (value: string) => {
    const recruitTypeValue = value === 'all' ? '' : value
    onFiltersChange({ ...filters, recruit_type: recruitTypeValue, page: 1 })
  }

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      search: '',
      state: '',
      recruit_type: '',
      page: 1
    })
  }

  const hasActiveFilters = filters.search || filters.state || filters.recruit_type

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">검색</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="제목, 설명으로 검색..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Select value={filters.state || 'all'} onValueChange={handleStateChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="WAITING_MATCH">모집 중</SelectItem>
            <SelectItem value="MATCHED">매칭 완료</SelectItem>
            <SelectItem value="COMPLETED">촬영 완료</SelectItem>
            <SelectItem value="CANCELLED">취소됨</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.recruit_type || 'all'} onValueChange={handleRecruitTypeChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="모집 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 유형</SelectItem>
            <SelectItem value="model">모델</SelectItem>
            <SelectItem value="photographer">작가</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            초기화
          </Button>
        )}
      </div>
    </div>
  )
}
