import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT and get user
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    'ADMIN': ['create', 'read', 'update', 'delete'],
    'MASTER_GUIDE': ['create', 'read', 'update'],
    'DIRECTOR': ['create', 'read', 'update'],
    'SECRETARY': ['read', 'update'],
    'INSTRUCTOR': ['read'],
    'LEADER': ['read'],
    'MEMBER': ['read']
  }

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false
}

// POST /api/members/assign-position - Assign position to member
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'update')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, positionId, yearId, startDate, endDate, notes } = body

    if (!userId || !positionId || !yearId || !startDate) {
      return NextResponse.json(
        { error: 'User ID, position ID, year ID, and start date are required' },
        { status: 400 }
      )
    }

    // Get user and verify permissions
    const currentUser = await db.user.findUnique({
      where: { id: user.userId },
      include: { club: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get target user and position
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { clubId: true }
    })

    const position = await db.clubPosition.findUnique({
      where: { id: positionId },
      select: { clubId: true }
    })

    const year = await db.clubYear.findUnique({
      where: { id: yearId },
      select: { clubId: true }
    })

    if (!targetUser || !position || !year) {
      return NextResponse.json({ error: 'Invalid user, position, or year' }, { status: 404 })
    }

    // Verify all belong to the same club and user has access
    const clubId = currentUser.clubId || currentUser.role === 'ADMIN' ? targetUser.clubId : null
    if (!clubId || targetUser.clubId !== clubId || position.clubId !== clubId || year.clubId !== clubId) {
      return NextResponse.json({ error: 'Access denied - different clubs' }, { status: 403 })
    }

    if (currentUser.role !== 'ADMIN' && currentUser.clubId !== clubId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update user's position
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { positionId }
    })

    // Create service year record
    const serviceYear = await db.userClubYear.create({
      data: {
        userId,
        clubId,
        yearId,
        positionId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        position: {
          select: { id: true, title: true, level: true }
        },
        year: {
          select: { id: true, year: true, theme: true }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Position assigned successfully',
      user: updatedUser,
      serviceYear
    })
  } catch (error) {
    console.error('Assign position error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/members/assign-position - Update position assignment
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'update')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { id, endDate, notes, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Service year ID is required' }, { status: 400 })
    }

    // Get existing service year
    const existingServiceYear = await db.userClubYear.findUnique({
      where: { id },
      include: {
        user: { select: { clubId: true } },
        year: { select: { clubId: true } }
      }
    })

    if (!existingServiceYear) {
      return NextResponse.json({ error: 'Service year not found' }, { status: 404 })
    }

    // Verify permissions
    const currentUser = await db.user.findUnique({
      where: { id: user.userId },
      select: { clubId: true, role: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const clubId = existingServiceYear.user.clubId
    if (currentUser.role !== 'ADMIN' && currentUser.clubId !== clubId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update service year
    const updatedServiceYear = await db.userClubYear.update({
      where: { id },
      data: {
        endDate: endDate ? new Date(endDate) : undefined,
        notes,
        isActive: isActive !== undefined ? isActive : undefined
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        position: {
          select: { id: true, title: true, level: true }
        },
        year: {
          select: { id: true, year: true, theme: true }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Position assignment updated successfully',
      serviceYear: updatedServiceYear
    })
  } catch (error) {
    console.error('Update position assignment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}