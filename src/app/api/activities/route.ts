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

// GET /api/activities - Get activities (with role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let whereClause: any = {}

    // Filter based on user role
    if (user.role === 'ADMIN') {
      // Admin can see all activities
      if (clubId) whereClause.clubId = clubId
      if (category) whereClause.category = category
      if (status) whereClause.status = status
    } else {
      // Other users can only see activities of their club
      whereClause.clubId = user.clubId
      if (category) whereClause.category = category
      if (status) whereClause.status = status
    }

    const activities = await db.activity.findMany({
      where: whereClause,
      include: {
        club: {
          select: { id: true, name: true, slug: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Get activities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/activities - Create new activity (Admin/Master Guide only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      category, 
      startDate, 
      endDate, 
      location, 
      status,
      clubId 
    } = body

    // Determine club ID
    let activityClubId = clubId
    if (!activityClubId && user.role !== 'ADMIN') {
      activityClubId = user.clubId
    }

    const activity = await db.activity.create({
      data: {
        title,
        description,
        category,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        status: status || 'upcoming',
        clubId: activityClubId,
        createdBy: user.userId
      },
      include: {
        club: {
          select: { id: true, name: true, slug: true }
        },
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error('Create activity error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}