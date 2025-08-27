import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getShootings } from '@/lib/data/shootings'
import { ShootingList } from '@/components/shootings/ShootingList'

interface ShootingsPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    state?: string
    recruit_type?: string
  }>
}

export default async function ShootingsPage({ searchParams }: ShootingsPageProps) {
  const params = await searchParams
  
  const queryParams = {
    page: parseInt(params.page || '1'),
    limit: parseInt(params.limit || '10'),
    search: params.search || '',
    state: params.state || '',
    recruit_type: params.recruit_type || '',
  }

  const initialData = await getShootings(queryParams)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">촬영 관리</h1>
          <p className="text-muted-foreground">
            앱 서비스의 모든 촬영 프로젝트를 관리하세요
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 촬영 추가
        </Button>
      </div>
      
      <ShootingList initialData={initialData} />
    </div>
  )
}
