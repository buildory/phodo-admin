import { NextRequest, NextResponse } from 'next/server'
import { getAppVersionById, updateAppVersion, deleteAppVersion } from '@/lib/data/app'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const version = await getAppVersionById(id)
    
    if (!version) {
      return NextResponse.json(
        { error: '앱 버전을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(version)
  } catch (error) {
    console.error('Error in GET /api/app-versions/[id]:', error)
    return NextResponse.json(
      { error: '앱 버전을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    
    const updatedVersion = await updateAppVersion(id, body)
    
    if (!updatedVersion) {
      return NextResponse.json(
        { error: '앱 버전을 찾을 수 없거나 업데이트에 실패했습니다.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedVersion)
  } catch (error) {
    console.error('Error in PUT /api/app-versions/[id]:', error)
    return NextResponse.json(
      { error: '앱 버전 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const success = await deleteAppVersion(id)
    
    if (!success) {
      return NextResponse.json(
        { error: '앱 버전을 찾을 수 없거나 삭제에 실패했습니다.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: '앱 버전이 성공적으로 삭제되었습니다.' })
  } catch (error) {
    console.error('Error in DELETE /api/app-versions/[id]:', error)
    return NextResponse.json(
      { error: '앱 버전 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}