import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  Eye,
  Clock,
  Calendar
} from 'lucide-react'
import { Analytics } from '@/types/database'

// Mock data
const mockAnalytics: Analytics[] = [
  {
    id: '1',
    app_id: '1',
    metric_name: '일일 활성 사용자',
    metric_value: 1247,
    date: '2024-02-15',
    created_at: '2024-02-15T00:00:00Z'
  },
  {
    id: '2',
    app_id: '1',
    metric_name: '월간 활성 사용자',
    metric_value: 8920,
    date: '2024-02-01',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    app_id: '2',
    metric_name: '일일 활성 사용자',
    metric_value: 856,
    date: '2024-02-15',
    created_at: '2024-02-15T00:00:00Z'
  },
  {
    id: '4',
    app_id: '2',
    metric_name: '월간 활성 사용자',
    metric_value: 6540,
    date: '2024-02-01',
    created_at: '2024-02-01T00:00:00Z'
  }
]

async function getAnalytics(): Promise<Analytics[]> {
  // 실제 구현에서는 Supabase에서 데이터를 가져옴
  // const supabase = createClient()
  // const { data, error } = await supabase.from('analytics').select('*')
  
  return mockAnalytics
}

function MetricCard({ title, value, change, icon: Icon, description }: {
  title: string
  value: string | number
  change?: string
  icon: any
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
        {change && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="총 사용자"
        value="12,847"
        change="+12% 이번 달"
        icon={Users}
        description="전체 등록 사용자"
      />
      <MetricCard
        title="활성 사용자"
        value="8,920"
        change="+8% 이번 주"
        icon={Activity}
        description="일일 활성 사용자"
      />
      <MetricCard
        title="앱 다운로드"
        value="45,678"
        change="+15% 이번 달"
        icon={Download}
        description="총 다운로드 수"
      />
      <MetricCard
        title="평균 세션"
        value="8.5분"
        change="+2% 이번 주"
        icon={Clock}
        description="평균 사용 시간"
      />
    </div>
  )
}

function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 활동 추이</CardTitle>
        <CardDescription>
          최근 30일간의 사용자 활동을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">차트가 여기에 표시됩니다</p>
            <p className="text-sm text-gray-400">실제 구현에서는 Chart.js 또는 Recharts를 사용</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AnalyticsTable({ analytics }: { analytics: Analytics[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>분석 데이터</CardTitle>
        <CardDescription>
          수집된 모든 분석 데이터를 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{item.metric_name}</p>
                  <p className="text-sm text-muted-foreground">앱 ID: {item.app_id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{item.metric_value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AppPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>앱별 성능</CardTitle>
        <CardDescription>
          각 앱의 성능 지표를 비교해보세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Phodo Photo Editor</p>
                <p className="text-sm text-muted-foreground">가장 인기 있는 앱</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">1,247</p>
              <p className="text-sm text-green-600">+15% 증가</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Phodo Gallery</p>
                <p className="text-sm text-muted-foreground">안정적인 성능</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">856</p>
              <p className="text-sm text-green-600">+8% 증가</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Phodo Share</p>
                <p className="text-sm text-muted-foreground">점검 중</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">234</p>
              <p className="text-sm text-red-600">-5% 감소</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">분석</h1>
          <p className="text-muted-foreground">
            앱 서비스의 성능과 사용자 활동을 분석하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            기간 선택
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            데이터 내보내기
          </Button>
        </div>
      </div>

      <AnalyticsOverview />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="performance">앱별 성능</TabsTrigger>
          <TabsTrigger value="data">원시 데이터</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <AnalyticsChart />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <AppPerformance />
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Suspense fallback={<div>분석 데이터를 불러오는 중...</div>}>
            <AnalyticsTable analytics={analytics} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
