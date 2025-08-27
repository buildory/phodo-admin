import { getUserById, getUserStats, getUserShootings } from '@/lib/data/users'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Mail, Calendar, MapPin, Camera } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
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

const getGenderLabel = (gender: string) => {
  switch (gender) {
    case 'male': return '남성'
    case 'female': return '여성'
    case 'non_binary': return '논바이너리'
    case 'prefer_not_to_say': return '선택안함'
    default: return gender
  }
}

const getShootingStateLabel = (state: string) => {
  switch (state) {
    case 'WAITING_MATCH': return '매칭 대기'
    case 'MATCHED': return '매칭 완료'
    case 'COMPLETED': return '완료'
    case 'CANCELLED': return '취소'
    default: return state
  }
}

const getShootingStateVariant = (state: string) => {
  switch (state) {
    case 'WAITING_MATCH': return 'outline'
    case 'MATCHED': return 'secondary'
    case 'COMPLETED': return 'default'
    case 'CANCELLED': return 'destructive'
    default: return 'outline'
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const user = await getUserById(id)
  console.log(user)
  if (!user) {
    notFound()
  }

  // 유저 통계와 촬영 활동 가져오기
  const [userStats, userShootings] = await Promise.all([
    getUserStats(id),
    getUserShootings(id, 5)
  ])

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">사용자 상세 정보</h1>
            <p className="text-muted-foreground">
              사용자의 상세 정보를 확인하고 관리할 수 있습니다
            </p>
          </div>
        </div>
          <div className="flex items-center gap-2">
            <Edit className="h-6 w-6 mr-1 cursor-pointer" />
            <Trash2 className="h-6 w-6 cursor-pointer text-red-400" />
          </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 프로필 카드 */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
            <CardDescription>사용자의 기본 프로필 정보</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profile_image} alt={user.nickname} />
                <AvatarFallback className="text-2xl">
                  {user.nickname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{user.nickname}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">가입일: {formatDate(user.created_at)}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">성별: {getGenderLabel(user.gender)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">역할</span>
                <Badge variant={getRoleVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">상태</span>
                <Badge variant={getStatusVariant(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상세 정보 카드 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>상세 정보</CardTitle>
            <CardDescription>사용자의 추가 정보 및 활동 내역</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">사용자 ID</label>
                <p className="text-sm">{user.id}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">닉네임</label>
                <p className="text-sm">{user.nickname}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">이메일</label>
                <p className="text-sm">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">성별</label>
                <p className="text-sm">{getGenderLabel(user.gender)}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">가입일</label>
                <p className="text-sm">{formatDate(user.created_at)}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">마지막 업데이트</label>
                <p className="text-sm">{formatDate(user.updated_at)}</p>
              </div>
            </div>

            {/* 권한 정보 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">권한 정보</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">역할</label>
                  <div>
                    <Badge variant={getRoleVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">계정 상태</label>
                  <div>
                    <Badge variant={getStatusVariant(user.status)}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 활동 통계 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">활동 통계</h4>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalShootings}</div>
                  <div className="text-sm text-muted-foreground">총 촬영</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userStats.completedShootings}</div>
                  <div className="text-sm text-muted-foreground">완료된 촬영</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{userStats.activeShootings}</div>
                  <div className="text-sm text-muted-foreground">진행중인 촬영</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{userStats.waitingShootings}</div>
                  <div className="text-sm text-muted-foreground">대기중인 촬영</div>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">최근 촬영 활동</h4>
              {userShootings.length > 0 ? (
                <div className="space-y-3">
                  {userShootings.map((shooting) => (
                    <div key={shooting.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{shooting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(shooting.created_at)}
                        </p>
                      </div>
                      <Badge variant={getShootingStateVariant(shooting.state)}>
                        {getShootingStateLabel(shooting.state)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p>아직 촬영 활동이 없습니다</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
