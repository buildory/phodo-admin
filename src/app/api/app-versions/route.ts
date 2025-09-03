import { NextRequest, NextResponse } from 'next/server'
import { getAppVersions, createAppVersion } from '@/lib/data/app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') as 'ios' | 'android' | 'codepush' | null
    
    let versions
    if (platform) {
      const { getAppVersionsByPlatform } = await import('@/lib/data/app')
      versions = await getAppVersionsByPlatform(platform)
    } else {
      versions = await getAppVersions()
    }
    
    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error in GET /api/app-versions:', error)
    return NextResponse.json(
      { error: '앱 버전 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 필수 필드 검증
    const requiredFields = ['platform', 'latest_version', 'min_supported_version', 'store_url', 'min_native_supported']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} 필드는 필수입니다.` },
          { status: 400 }
        )
      }
    }
    
    const newVersion = await createAppVersion({
      platform: body.platform,
      latest_version: body.latest_version,
      min_supported_version: body.min_supported_version,
      force_update: body.force_update || false,
      store_url: body.store_url,
      notes: body.notes,
      min_native_supported: body.min_native_supported
    })
    
    if (!newVersion) {
      return NextResponse.json(
        { error: '앱 버전 생성에 실패했습니다.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(newVersion, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/app-versions:', error)
    return NextResponse.json(
      { error: '앱 버전 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}