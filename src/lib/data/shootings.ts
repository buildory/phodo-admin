import { createServerComponentsClient } from '@/lib/supabase-server'
import { Shooting } from '@/types/database'

export interface ShootingListParams {
  page?: number
  limit?: number
  search?: string
  title?: string
  state?: string
  recruit_type?: string
}

export interface ShootingListResponse {
  shootings: Shooting[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getShootings(params: ShootingListParams = {}): Promise<ShootingListResponse> {
  const supabase = await createServerComponentsClient()
  
  const {
    page = 1,
    limit = 10,
    search = '',
    title = '',
    state = '',
    recruit_type = ''
  } = params

  try {
    // profiles 테이블과 join하여 데이터 가져오기
    let query = supabase
      .from('projects')
      .select(`
        *,
        profiles!projects_user_id_fkey (
          id,
          email,
          nickname,
          gender,
          profile_image,
          role,
          status,
          created_at
        )
      `, { count: 'exact' })

    // 검색 필터
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 제목 필터
    if (title) {
      query = query.ilike('title', `%${title}%`)
    }

    // 상태 필터
    if (state) {
      query = query.eq('state', state)
    }

    // 모집 타입 필터
    if (recruit_type) {
      query = query.eq('recruit_type', recruit_type)
    }

    // 페이지네이션
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: shootings, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching shootings:', error)
      throw new Error('Failed to fetch shootings')
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      shootings: shootings || [],
      total,
      page,
      limit,
      totalPages
    }
  } catch (error) {
    console.error('Error in getShootings:', error)
    throw error
  }
}

export async function getShootingById(shootingId: number): Promise<Shooting | null> {
  const supabase = await createServerComponentsClient()
  
  const { data: shooting, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles!projects_user_id_fkey (
        id,
        email,
        nickname,
        gender,
        profile_image,
        role,
        status,
        created_at
      )
    `)
    .eq('id', shootingId)
    .single()

  if (error) {
    console.error('Error fetching shooting:', error)
    return null
  }

  return shooting
}

export async function getShootingsCount(): Promise<number> {
  const supabase = await createServerComponentsClient()
  
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching shootings count:', error)
    return 0
  }

  return count || 0
}