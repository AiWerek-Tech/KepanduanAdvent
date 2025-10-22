import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { checkServerPermission } from '@/lib/roleGuard'

// GET /api/service-history - Get service history
export async function GET(request: NextRequest) {
  try {
    const session = await auth(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')
    const userId = searchParams.get('userId')
    const yearId = searchParams.get('yearId')

    if (!clubId) {
      return NextResponse.json({ error: 'Club ID is required' }, { status: 400 })
    }

    // Check if user has permission to read service history
    if (!checkServerPermission(session.user, 'members:view')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Verify user is member of the club or is admin
    const userClub = await db.user.findUnique({
      where: { id: session.user.id },
      select: { clubId: true, role: true }
    })

    if (!userClub || (userClub.clubId !== clubId && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build where clause
    const whereClause: any = { clubId }
    if (userId) whereClause.userId = userId
    if (yearId) whereClause.yearId = yearId

    const serviceHistory = await db.userClubYear.findMany({
      where: whereClause,
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            avatar: true,
            role: true 
          }
        },
        position: {
          select: { 
            id: true, 
            title: true, 
            level: true 
          }
        },
        year: {
          select: { 
            id: true, 
            year: true, 
            theme: true,
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    })

    return NextResponse.json({ serviceHistory })
  } catch (error) {
    console.error('Get service history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/service-history - Create new service history entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!checkServerPermission(session.user, 'members:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, clubId, yearId, positionId, classLevel, mentorId, startDate, endDate, notes } = body

    if (!userId || !clubId || !yearId || !startDate) {
      return NextResponse.json(
        { error: 'User ID, club ID, year ID, and start date are required' },
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

    // Check if entry already exists
    const existingEntry = await db.userClubYear.findUnique({
      where: { userId_clubId_yearId: { userId, clubId, yearId } }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Service history entry already exists for this user, club, and year' },
        { status: 400 }
      )
    }

    const serviceHistory = await db.userClubYear.create({
      data: {
        userId,
        clubId,
        yearId,
        positionId,
        classLevel,
        mentorId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes
      },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            role: true 
          }
        },
        position: {
          select: { 
            id: true, 
            title: true, 
            level: true 
          }
        },
        year: {
          select: { 
            id: true, 
            year: true, 
            theme: true 
          }
        }
      }
    })

    return NextResponse.json({ serviceHistory }, { status: 201 })
  } catch (error) {
    console.error('Create service history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/service-history - Update service history entry
export async function PUT(request: NextRequest) {
  try {
    const session = await auth(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!checkServerPermission(session.user, 'members:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { id, positionId, classLevel, mentorId, endDate, isActive, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Service history ID is required' }, { status: 400 })
    }

    // Verify user has permission to update this entry
    const existingEntry = await db.userClubYear.findUnique({
      where: { id },
      include: {
        club: {
          select: { id: true }
        }
      }
    })

    if (!existingEntry) {
      return NextResponse.json({ error: 'Service history entry not found' }, { status: 404 })
    }

    const userClub = await db.user.findUnique({
      where: { id: session.user.id },
      select: { clubId: true, role: true }
    })

    if (!userClub || (userClub.clubId !== existingEntry.club.id && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updateData: any = {}
    if (positionId !== undefined) updateData.positionId = positionId
    if (classLevel !== undefined) updateData.classLevel = classLevel
    if (mentorId !== undefined) updateData.mentorId = mentorId
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (isActive !== undefined) updateData.isActive = isActive
    if (notes !== undefined) updateData.notes = notes

    const serviceHistory = await db.userClubYear.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            role: true 
          }
        },
        position: {
          select: { 
            id: true, 
            title: true, 
            level: true 
          }
        },
        year: {
          select: { 
            id: true, 
            year: true, 
            theme: true 
          }
        }
      }
    })

    return NextResponse.json({ serviceHistory })
  } catch (error) {
    console.error('Update service history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}