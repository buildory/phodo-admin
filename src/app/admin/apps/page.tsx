import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Settings, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { AppData } from '@/types/database'

// Mock data
const mockApps: AppData[] = [
  {
    id: '1',
    name: 'Phodo Photo Editor',
    description: 'AI 기반 사진 편집 앱',
    status: 'active',
    version: '2.1.0',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Phodo Gallery',
    description: '클라우드 기반 사진 갤러리',
    status: 'active',
    version: '1.8.5',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Phodo Share',
    description: '사진 공유 및 소셜 기능',
    status: 'maintenance',
    version: '1.5.2',
    created_at: '2024-01-25T09:15:00Z',
    updated_at: '2024-01-25T09:15:00Z'
  },
  {
    id: '4',
    name: 'Phodo Backup',
    description: '자동 백업 및 복원 서비스',
    status: 'inactive',
    version: '1.2.1',
    created_at: '2024-02-01T16:45:00Z',
    updated_at: '2024-02-01T16:45:00Z'
  }
]

async function getApps(): Promise<AppData[]> {
  // 실제 구현에서는 Supabase에서 데이터를 가져옴
  // const supabase = createClient()
  // const { data, error } = await supabase.from('apps').select('*')
  
  return mockApps
}

function getStatusBadge(status: AppData['status']) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">활성</Badge>
    case 'inactive':
      return <Badge variant="secondary">비활성</Badge>
    case 'maintenance':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">점검 중</Badge>
    default:
      return <Badge variant="outline">알 수 없음</Badge>
  }
}

function getStatusIcon(status: AppData['status']) {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'inactive':
      return <Pause className="h-4 w-4 text-gray-600" />
    case 'maintenance':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function AppTable({ apps }: { apps: AppData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>앱 이름</TableHead>
          <TableHead>설명</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>버전</TableHead>
          <TableHead>업데이트일</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apps.map((app) => (
          <TableRow key={app.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{app.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {app.id}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">
              {app.description}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(app.status)}
                {getStatusBadge(app.status)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{app.version}</Badge>
            </TableCell>
            <TableCell>
              {new Date(app.updated_at).toLocaleDateString('ko-KR')}
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

function AppStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 앱</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <p className="text-xs text-muted-foreground">
            +3 이번 주
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">활성 앱</CardTitle>
          <Play className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">
            78% 활성률
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">점검 중</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            예정된 업데이트
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">비활성</CardTitle>
          <Pause className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            일시 중지됨
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function AppsPage() {
  const apps = await getApps()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">앱 관리</h1>
          <p className="text-muted-foreground">
            앱 서비스의 모든 애플리케이션을 관리하세요
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 앱 추가
        </Button>
      </div>

      <AppStats />

      <Card>
        <CardHeader>
          <CardTitle>앱 목록</CardTitle>
          <CardDescription>
            등록된 모든 앱의 상태와 정보를 확인하고 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="앱 검색..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              필터
            </Button>
          </div>
          
          <Suspense fallback={<div>앱 목록을 불러오는 중...</div>}>
            <AppTable apps={apps} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
