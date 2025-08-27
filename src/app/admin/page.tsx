import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Clock,
  ArrowUpRight
} from 'lucide-react'
import { DashboardStats } from '@/types/database'

// Mock data - 실제로는 Supabase에서 가져올 데이터
const mockStats: DashboardStats = {
  total_users: 1247,
  total_apps: 23,
  active_apps: 18,
  total_analytics: 45678,
  recent_activity: [
    {
      id: '1',
      action: '새 사용자 등록',
      user: '김철수',
      timestamp: '2분 전'
    },
    {
      id: '2',
      action: '앱 업데이트',
      user: '이영희',
      timestamp: '5분 전'
    },
    {
      id: '3',
      action: '분석 데이터 수집',
      user: '시스템',
      timestamp: '10분 전'
    },
    {
      id: '4',
      action: '사용자 권한 변경',
      user: '관리자',
      timestamp: '15분 전'
    }
  ]
}

async function getDashboardStats(): Promise<DashboardStats> {
  // 실제 구현에서는 Supabase에서 데이터를 가져옴
  // const supabase = createClient()
  // const { data, error } = await supabase.from('dashboard_stats').select('*')
  
  // Mock data 반환
  return mockStats
}

function StatCard({ title, value, icon: Icon, trend, description }: {
  title: string
  value: string | number
  icon: any
  trend?: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            {trend}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          최근 활동
        </CardTitle>
        <CardDescription>
          시스템에서 발생한 최근 활동들을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockStats.recent_activity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          모든 활동 보기
          <ArrowUpRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 작업</CardTitle>
        <CardDescription>
          자주 사용하는 관리 기능들
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <Users className="h-6 w-6 mb-2" />
            사용자 관리
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Settings className="h-6 w-6 mb-2" />
            앱 설정
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <BarChart3 className="h-6 w-6 mb-2" />
            분석 보기
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Activity className="h-6 w-6 mb-2" />
            시스템 상태
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          앱 서비스의 전체적인 현황을 한눈에 확인하세요
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 사용자"
          value={stats.total_users.toLocaleString()}
          icon={Users}
          trend="+12% 이번 달"
          description="전월 대비 증가율"
        />
        <StatCard
          title="총 앱"
          value={stats.total_apps}
          icon={Settings}
          trend="+3 이번 주"
          description="새로 추가된 앱"
        />
        <StatCard
          title="활성 앱"
          value={stats.active_apps}
          icon={Activity}
          trend="78% 활성률"
          description="전체 앱 대비"
        />
        <StatCard
          title="분석 데이터"
          value={stats.total_analytics.toLocaleString()}
          icon={BarChart3}
          trend="+5.2% 오늘"
          description="수집된 데이터 포인트"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <RecentActivity />
          </Suspense>
        </div>
        <div className="col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
