import { getShootingById } from '@/lib/data/shootings'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shooting = await getShootingById(parseInt(params.id))
    
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

