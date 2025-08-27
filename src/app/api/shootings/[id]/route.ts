import { getShootingById } from '@/lib/data/shootings'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const shooting = await getShootingById(parseInt(id))
    
    if (!shooting) {
      return NextResponse.json({ error: 'Shooting not found' }, { status: 404 })
    }
    
    return NextResponse.json(shooting)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

