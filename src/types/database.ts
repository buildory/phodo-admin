export interface User {
  id: string
  email: string
  nickname: string
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say'
  profile_image?: string
  role: 'admin' | 'manager' | 'staff' | 'user' | 'guest'
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'deleted'
  created_at: string
  updated_at: string
}

export interface AppData {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive' | 'maintenance'
  version: string
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  app_id: string
  metric_name: string
  metric_value: number
  date: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  created_at: string
}

export interface DashboardStats {
  total_users: number
  total_apps: number
  active_apps: number
  total_analytics: number
  recent_activity: Array<{
    id: string
    action: string
    user: string
    timestamp: string
  }>
}

export interface Shooting {
  id: number
  recruit_type: 'model' | 'photographer'
  pin_display: string
  input_location: string
  location_address: string
  available_days: string[]
  available_start_time: string
  available_end_time: string
  is_paid: boolean
  request_note: string
  price_per_hour: number | null
  duration_hours: number | null
  device_source: string
  title: string
  description: string
  created_at: string
  user_id: string
  latitude: number
  longitude: number
  date_mode: 'single' | 'range'
  available_dates: string[]
  state: 'WAITING_MATCH' | 'MATCHED' | 'COMPLETED' | 'CANCELLED'
  profiles?: User
}
