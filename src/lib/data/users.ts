import { createServerComponentsClient } from '@/lib/supabase-server'
import { User } from '@/types/database'

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserStats {
  totalShootings: number
  completedShootings: number
  activeShootings: number
  waitingShootings: number
}

// 테이블 구조 확인용 함수
export async function checkTableStructure() {
  const supabase = await createServerComponentsClient()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Table structure error:', error)
      return null
    }
    
    console.log('Table structure:', data?.[0] ? Object.keys(data[0]) : 'No data')
    return data?.[0] ? Object.keys(data[0]) : []
  } catch (error) {
    console.error('Error checking table structure:', error)
    return null
  }
}

export async function getUsers(params: UserListParams = {}): Promise<UserListResponse> {
  const supabase = await createServerComponentsClient()
  
  const {
    page = 1,
    limit = 10,
    search = '',
    role = '',
    status = ''
  } = params

  try {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })

    // 검색 필터 - nickname과 email로 검색
    if (search) {
      query = query.or(`nickname.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // 역할 필터
    if (role) {
      query = query.eq('role', role)
    }

    // 상태 필터
    if (status) {
      query = query.eq('status', status)
    }

    // 페이지네이션
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: users, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      // 테이블 구조 확인
      await checkTableStructure()
      throw new Error('Failed to fetch users')
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      users: users || [],
      total,
      page,
      limit,
      totalPages
    }
  } catch (error) {
    console.error('Error in getUsers:', error)
    throw error
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await createServerComponentsClient()
  
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = await createServerComponentsClient()
  
  try {
    // 해당 유저의 모든 촬영 프로젝트 가져오기
    const { data: shootings, error } = await supabase
      .from('projects')
      .select('state')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalShootings: 0,
        completedShootings: 0,
        activeShootings: 0,
        waitingShootings: 0
      }
    }

    const totalShootings = shootings?.length || 0
    const completedShootings = shootings?.filter(s => s.state === 'COMPLETED').length || 0
    const activeShootings = shootings?.filter(s => s.state === 'MATCHED').length || 0
    const waitingShootings = shootings?.filter(s => s.state === 'WAITING_MATCH').length || 0

    return {
      totalShootings,
      completedShootings,
      activeShootings,
      waitingShootings
    }
  } catch (error) {
    console.error('Error in getUserStats:', error)
    return {
      totalShootings: 0,
      completedShootings: 0,
      activeShootings: 0,
      waitingShootings: 0
    }
  }
}

export async function getUserShootings(userId: string, limit: number = 5) {
  const supabase = await createServerComponentsClient()
  
  try {
    const { data: shootings, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        state,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user shootings:', error)
      return []
    }

    return shootings || []
  } catch (error) {
    console.error('Error in getUserShootings:', error)
    return []
  }
}

export async function getUsersCount(): Promise<number> {
  const supabase = await createServerComponentsClient()
  
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching users count:', error)
    return 0
  }

  return count || 0
}
