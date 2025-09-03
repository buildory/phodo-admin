'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  Smartphone, 
  Globe, 
  Apple,
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { AppVersion } from '@/types/database'

interface AppVersionTableProps {
  versions: AppVersion[]
}

function getPlatformIcon(platform: AppVersion['platform']) {
  switch (platform) {
    case 'ios':
      return <Apple className="h-4 w-4 text-gray-600" />
    case 'android':
      return <Smartphone className="h-4 w-4 text-green-600" />
    case 'web':
      return <Globe className="h-4 w-4 text-blue-600" />
    default:
      return <Smartphone className="h-4 w-4 text-gray-600" />
  }
}

function getPlatformBadge(platform: AppVersion['platform']) {
  const variants = {
    ios: 'default' as const,
    android: 'secondary' as const,
    codepush: 'outline' as const,
    web: 'outline' as const
  }
  
  const labels = {
    ios: 'iOS',
    android: 'Android',
    codepush: 'CodePush',
    web: 'Web'
  }
  
  return (
    <Badge variant={variants[platform]}>
      {labels[platform]}
    </Badge>
  )
}

function getForceUpdateBadge(forceUpdate: boolean) {
  if (forceUpdate) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        강제 업데이트
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      선택적 업데이트
    </Badge>
  )
}

export default function AppVersionTable({ versions }: AppVersionTableProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>플랫폼</TableHead>
          <TableHead>최신 버전</TableHead>
          <TableHead>최소 지원 버전</TableHead>
          <TableHead>업데이트 정책</TableHead>
          <TableHead>스토어 URL</TableHead>
          <TableHead>수정일</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {versions.map((version) => (
          <TableRow key={version.platform}>
            <TableCell>
              <div className="flex items-center gap-3">
                {getPlatformIcon(version.platform)}
                {getPlatformBadge(version.platform)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                {version.latest_version}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="font-mono">
                {version.min_supported_version}
              </Badge>
            </TableCell>
            <TableCell>
              {getForceUpdateBadge(version.force_update)}
            </TableCell>
            <TableCell>
              {version.store_url ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {version.store_url}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(version.store_url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              ) : (
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  -
                </span>
              )}
            </TableCell>
            <TableCell>
              {new Date(version.updated_at).toLocaleDateString('ko-KR')}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedVersion(
                  selectedVersion === version.id ? null : version.id
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}