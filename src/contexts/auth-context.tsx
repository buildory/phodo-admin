'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/database'
import { createClient } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const supabase = createClient()

  // 초기 로드 시 Supabase 세션 확인
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setIsLoading(false)
      } finally {
        setIsInitialized(true)
      }
    }

    getInitialSession()
  }, [])

  // 초기화 완료 후에만 인증 상태 변경 리스너 활성화
  useEffect(() => {
    if (!isInitialized) return
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsLoading(false)
        } else if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setUser(null)
          setIsLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [isInitialized])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // profiles 테이블에서 사용자 정보 가져오기
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        setIsLoading(false)
        return
      }

      // 프로필이 없으면 기본값 사용
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        nickname: profile?.nickname || supabaseUser.user_metadata?.nickname || '사용자',
        profile_image: profile?.profile_image || supabaseUser.user_metadata?.profile_image || '',
        gender: profile?.gender || 'prefer_not_to_say',
        role: profile?.role || 'user',
        status: profile?.status || 'active',
        created_at: supabaseUser.created_at,
        updated_at: profile?.updated_at || supabaseUser.created_at
      }

      // admin 권한이 아닌 경우 로그인 차단
      if (userData.role !== 'admin') {
        await supabase.auth.signOut()
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser(userData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        return false
      }

      if (data.user) {
        // admin 권한 체크
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          return false
        }

        // admin 권한이 아닌 경우 로그인 거부
        if (profile?.role !== 'admin') {
          await supabase.auth.signOut()
          return false
        }

        await fetchUserProfile(data.user)
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}