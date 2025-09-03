import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Globe,
  Apple
} from 'lucide-react'
import { AppVersion } from '@/types/database'
import { getAppVersions } from '@/lib/data/app'
import AppVersionTable from '@/components/apps/AppVersionTable'

function VersionStats({ versions }: { versions: AppVersion[] }) {
  const iosVersions = versions.filter(v => v.platform === 'ios')
  const androidVersions = versions.filter(v => v.platform === 'android')
  const codepushVersions = versions.filter(v => v.platform === 'codepush')
  const forceUpdateVersions = versions.filter(v => v.force_update)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">iOS 버전</CardTitle>
          <Apple className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{iosVersions.length}</div>
          <p className="text-xs text-muted-foreground">
            최신: {iosVersions[0]?.latest_version || 'N/A'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Android 버전</CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{androidVersions.length}</div>
          <p className="text-xs text-muted-foreground">
            최신: {androidVersions[0]?.latest_version || 'N/A'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CodePush 버전</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{codepushVersions.length}</div>
          <p className="text-xs text-muted-foreground">
            최신: {codepushVersions[0]?.latest_version || 'N/A'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">강제 업데이트</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{forceUpdateVersions.length}</div>
          <p className="text-xs text-muted-foreground">
            업데이트 필요
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function AppsPage() {
  const versions = await getAppVersions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">앱 버전 관리</h1>
          <p className="text-muted-foreground">
            각 플랫폼별 앱 버전 정보를 확인하고 관리하세요
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 버전 추가
        </Button>
      </div>

      <VersionStats versions={versions} />
      
      <Card>
        <CardHeader>
          <CardTitle>앱 버전 목록</CardTitle>
          <CardDescription>
            각 플랫폼별 앱 버전 정보를 확인하고 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="버전 검색..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              플랫폼 필터
            </Button>
          </div>
          
          <Suspense fallback={<div>버전 목록을 불러오는 중...</div>}>
            <AppVersionTable versions={versions} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
