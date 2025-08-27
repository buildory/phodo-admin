import { createClient } from './supabase'
import { User } from '@/types/database'

export async function getCurrentUser(): Promise<User | null> {
  // 환경 변수가 설정되지 않은 경우 Mock 사용자 반환
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
    return {
      id: 'mock-user-id',
      email: 'admin@phodo.com',
      name: '관리자',
      avatar_url: '',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      avatar_url: profile.avatar_url,
      role: profile.role || 'user',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  // 환경 변수가 설정되지 않은 경우 로컬 리다이렉트만 수행
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co') {
    return
  }

  const supabase = createClient()
  await supabase.auth.signOut()
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

export function requireAuth() {
  // This will be used in middleware or server components
  return async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }
}
