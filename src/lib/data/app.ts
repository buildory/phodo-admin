import { createServerComponentsClient } from '@/lib/supabase-server'
import { AppVersion } from '@/types/database'

export async function getAppVersions(): Promise<AppVersion[]> {
  try {
    const supabase = await createServerComponentsClient()
    const { data, error } = await supabase
      .from('app_versions')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching app versions:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getAppVersions:', error)
    return []
  }
}

export async function getAppVersionById(id: string): Promise<AppVersion | null> {
  try {
    const supabase = await createServerComponentsClient()
    const { data, error } = await supabase
      .from('app_versions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching app version:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getAppVersionById:', error)
    return null
  }
}

export async function getAppVersionsByPlatform(platform: 'ios' | 'android' | 'codepush'): Promise<AppVersion[]> {
  try {
    const supabase = await createServerComponentsClient()
    const { data, error } = await supabase
      .from('app_versions')
      .select('*')
      .eq('platform', platform)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching app versions by platform:', error)
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getAppVersionsByPlatform:', error)
    return []
  }
}

export async function createAppVersion(versionData: Omit<AppVersion, 'id' | 'updated_at'>): Promise<AppVersion | null> {
  try {
    const supabase = await createServerComponentsClient()
    const { data, error } = await supabase
      .from('app_versions')
      .insert([{
        ...versionData,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating app version:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in createAppVersion:', error)
    return null
  }
}

export async function updateAppVersion(id: string, versionData: Partial<Omit<AppVersion, 'id' | 'updated_at'>>): Promise<AppVersion | null> {
  try {
    const supabase = await createServerComponentsClient()
    const { data, error } = await supabase
      .from('app_versions')
      .update({
        ...versionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating app version:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in updateAppVersion:', error)
    return null
  }
}

export async function deleteAppVersion(id: string): Promise<boolean> {
  try {
    const supabase = await createServerComponentsClient()
    const { error } = await supabase
      .from('app_versions')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting app version:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in deleteAppVersion:', error)
    return false
  }
}
