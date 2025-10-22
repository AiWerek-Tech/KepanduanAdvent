import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { checkServerPermission } from '@/lib/roleGuard'

// GET /api/positions - Get positions for a club
export async function GET(request: NextRequest) {
  try {
    const session = await auth(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')

    if (!clubId) {
      return NextResponse.json({ error: 'Club ID is required' }, { status: 400 })
    }

    // Check if user has permission to read positions
    if (!checkServerPermission(session.user, 'members:view')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Verify user is member of the club or is admin
    const userClub = await db.user.findUnique({
      where: { id: session.user.id },
      select: { clubId: true, role: true, positionId: true }
    })

    if (!userClub || (userClub.clubId !== clubId && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const positions = await db.clubPosition.findMany({
      where: { 
        clubId,
        isActive: true 
      },
      include: {
        _count: {
          select: { members: true }
        }
      },
      orderBy: { level: 'asc' }
    })

    return NextResponse.json({ positions })
  } catch (error) {
    console.error('Get positions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/positions - Create new position
export async function POST(request: NextRequest) {
  try {
    const session = await auth(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!checkServerPermission(session.user, 'club:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { clubId, title, description, level, permissions } = body

    if (!clubId || !title || !level) {
      return NextResponse.json(
        { error: 'Club ID, title, and level are required' },
        { status: 400 }
      )
    }

    // Verify user is admin or master guide of the club
    const userClub = await db.user.findUnique({
      where: { id: session.user.id },
      select: { clubId: true, role: true }
    })

    if (!userClub || (userClub.clubId !== clubId && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const position = await db.clubPosition.create({
      data: {
        clubId,
        title,
        description,
        level,
        permissions: permissions || {}
      }
    })

    return NextResponse.json({ position }, { status: 201 })
  } catch (error) {
    console.error('Create position error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}