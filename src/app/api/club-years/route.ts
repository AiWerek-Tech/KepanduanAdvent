import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { checkServerPermission } from '@/lib/roleGuard'

// GET /api/club-years - Get club years
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

    // Check if user has permission to read club years
    if (!checkServerPermission(session.user, 'club:view')) {
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

    const clubYears = await db.clubYear.findMany({
      where: { clubId },
      include: {
        _count: {
          select: { serviceYears: true }
        }
      },
      orderBy: { year: 'desc' }
    })

    return NextResponse.json({ clubYears })
  } catch (error) {
    console.error('Get club years error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/club-years - Create new club year
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
    const { clubId, year, theme, startDate, endDate, classStartDate, graduationDate } = body

    if (!clubId || !year || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Club ID, year, start date, and end date are required' },
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

    // Check if year already exists for this club
    const existingYear = await db.clubYear.findUnique({
      where: { clubId_year: { clubId, year } }
    })

    if (existingYear) {
      return NextResponse.json(
        { error: 'Club year already exists' },
        { status: 400 }
      )
    }

    // Deactivate previous years
    await db.clubYear.updateMany({
      where: { clubId },
      data: { isActive: false }
    })

    const clubYear = await db.clubYear.create({
      data: {
        clubId,
        year,
        theme,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        classStartDate: classStartDate ? new Date(classStartDate) : null,
        graduationDate: graduationDate ? new Date(graduationDate) : null,
        isActive: true
      }
    })

    return NextResponse.json({ clubYear }, { status: 201 })
  } catch (error) {
    console.error('Create club year error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}