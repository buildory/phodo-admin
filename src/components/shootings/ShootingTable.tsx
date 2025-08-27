'use client'

import { Shooting } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ShootingTableProps {
  shootings: Shooting[]
  isLoading: boolean
}

// 프로젝트 상태에 따라 적절한 마커 이미지를 반환하는 함수
const getMarkerImage = (shooting: Shooting) => {
  const { recruit_type, pin_display } = shooting
  const gender = shooting.profiles?.gender || 'prefer_not_to_say'
  
  // 기본 마커 이미지 경로
  let markerPath = '/markers/'
  
  // recruit_type에 따른 기본 설정
  if (recruit_type === 'model') {
    markerPath += 'model_'
  } else if (recruit_type === 'photographer') {
    markerPath += 'photographer_'
  } else {
    markerPath += 'default_'
  }
  
  // gender에 따른 설정
  if (gender === 'male') {
    markerPath += 'male'
  } else if (gender === 'female') {
    markerPath += 'female'
  } else {
    markerPath += 'none'
  }
  
  // pin_display에 따른 설정
  if (pin_display === 'bubble') {
    markerPath += '_bubble'
  } else if (pin_display === 'always') {
    markerPath += '_always'
  }
  
  markerPath += '.png'
  
  return markerPath
}

// 마커 이미지가 존재하지 않을 경우를 대비한 fallback 이미지
const getFallbackMarker = (shooting: Shooting) => {
  const { recruit_type } = shooting
  
  if (recruit_type === 'model') {
    return '/markers/model_default.png'
  } else if (recruit_type === 'photographer') {
    return '/markers/photographer_default.png'
  }
  
  return '/markers/default.png'
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'super_admin': return '슈퍼 관리자'
    case 'admin': return '관리자'
    case 'moderator': return '모더레이터'
    case 'user': return '사용자'
    default: return role
  }
}

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'super_admin': return 'destructive'
    case 'admin': return 'default'
    case 'moderator': return 'secondary'
    case 'user': return 'outline'
    default: return 'secondary'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'WAITING_MATCH': return '촬영 모집 중'
    case 'MATCHED': return '매칭 완료'
    case 'COMPLETED': return '촬영 완료'
    case 'CANCELLED': return '취소됨'
    default: return status
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'WAITING_MATCH': return 'outline'
    case 'MATCHED': return 'secondary'
    case 'COMPLETED': return 'default'
    case 'CANCELLED': return 'destructive'
    default: return 'outline'
  }
}

export function ShootingTable({ shootings, isLoading }: ShootingTableProps) {
  console.log(shootings)
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>아이디</TableHead>
          <TableHead>모집 유형</TableHead>
          <TableHead>제목</TableHead>
          <TableHead>위치</TableHead>
          <TableHead>유저</TableHead>
          <TableHead>유료/무료</TableHead>
          <TableHead>시간당 가격</TableHead>
          <TableHead>가용 일자</TableHead>
          <TableHead>생성일</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shootings.map((shooting) => (
          <TableRow key={shooting.id}>
            <TableCell>
              {shooting.id}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <img 
                  src={getMarkerImage(shooting)} 
                  alt={`${shooting.recruit_type} marker`} 
                  className="w-8 h-8"
                  onError={(e) => {
                    // 이미지 로드 실패 시 fallback 이미지 사용
                    const target = e.target as HTMLImageElement
                    target.src = getFallbackMarker(shooting)
                  }}
                />
                <div className="text-xs text-gray-500">
                  <div>{shooting.recruit_type === 'model' ? '모델' : '작가'}</div>
                  <div>{shooting.pin_display === 'bubble' ? '버블' : '항상'}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
                {shooting.title}
            </TableCell>
            <TableCell>
                {shooting.location_address}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={shooting.profiles?.profile_image} alt={shooting.profiles?.nickname || 'User'} />
                  <AvatarFallback>
                    {shooting.profiles?.nickname?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">
                  {shooting.profiles?.nickname || '이름 없음'}
                </div>
              </div>
            </TableCell>
            <TableCell>
                {shooting.is_paid ? '유료' : '무료'}
            </TableCell>
            <TableCell>
                {shooting.price_per_hour || 0}
            </TableCell>
            <TableCell>
                {shooting.available_days?.join(', ') || ''}
            </TableCell>
            <TableCell>
              {formatDate(shooting.created_at)}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(shooting.state)}>
                {getStatusLabel(shooting.state)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
