import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Filter
} from 'lucide-react'
import { getUsers } from '@/lib/data/users'
import { UserList } from '@/components/users/UserList'
import { UserStats } from '@/components/users/UserStats'

interface UsersPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    role?: string
    status?: string
  }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  
  const queryParams = {
    page: parseInt(params.page || '1'),
    limit: parseInt(params.limit || '10'),
    search: params.search || '',
    role: params.role || '',
    status: params.status || ''
  }

  const initialData = await getUsers(queryParams)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
          <p className="text-muted-foreground">
            앱 서비스의 모든 사용자를 관리하세요
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 사용자 추가
        </Button>
      </div>

      <UserStats />
      
      <UserList initialData={initialData} />
    </div>
  )
}
