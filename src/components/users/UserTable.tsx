'use client'

import { User } from '@/types/database'
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
import { MoreHorizontal, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface UserTableProps {
  users: User[]
  isLoading: boolean
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
    case 'active': return '활성'
    case 'inactive': return '비활성'
    case 'suspended': return '정지'
    default: return status
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active': return 'default'
    case 'inactive': return 'secondary'
    case 'suspended': return 'destructive'
    default: return 'outline'
  }
}

export function UserTable({ users, isLoading }: UserTableProps) {
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
          <TableHead>사용자</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>역할</TableHead>
          <TableHead>성별</TableHead>
          <TableHead>가입일</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profile_image} alt={user.email} />
                  <AvatarFallback>
                    {user.nickname.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.nickname || '이름 없음'}</p>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={getRoleVariant(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </TableCell>
            <TableCell>
                {user.gender}
            </TableCell>
            <TableCell>
              {formatDate(user.created_at)}
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(user.status)}>
                {getStatusLabel(user.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/users/${user.id}`}>
                    <Eye className="h-4 w-4" />
                </Link>
                {/* <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button> */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
