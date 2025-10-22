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

// GET /api/clubs - Get clubs (with role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let clubs

    if (user.role === 'ADMIN') {
      // Admin can see all clubs
      clubs = await db.club.findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          members: {
            select: { 
              id: true, 
              name: true, 
              email: true, 
              role: true,
              phone: true,
              avatar: true,
              progress: true
            }
          },
          activities: {
            where: {
              startDate: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
              }
            },
            orderBy: { startDate: 'desc' },
            take: 10
          },
          _count: {
            select: { 
              members: true,
              activities: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Other users can only see their club
      clubs = await db.club.findMany({
        where: {
          members: {
            some: { id: user.userId }
          }
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          members: {
            select: { 
              id: true, 
              name: true, 
              email: true, 
              role: true,
              phone: true,
              avatar: true,
              progress: true
            }
          },
          activities: {
            where: {
              startDate: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
              }
            },
            orderBy: { startDate: 'desc' },
            take: 10
          },
          _count: {
            select: { 
              members: true,
              activities: true
            }
          }
        }
      })
    }

    // Transform clubs data to include statistics
    const clubsWithStats = clubs.map(club => ({
      ...club,
      statistics: {
        totalMembers: club._count.members,
        activeMembers: club.members.filter((member: any) => 
          member.role !== 'INACTIVE' && member.progress > 0
        ).length,
        totalActivities: club._count.activities,
        upcomingActivities: club.activities.filter((activity: any) => 
          new Date(activity.startDate) > new Date()
        ).length
      }
    }))

    return NextResponse.json({ clubs: clubsWithStats })
  } catch (error) {
    console.error('Get clubs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/clubs - Create new club (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, email, phone, address, church, district, conference } = body

    // Check if slug already exists
    const existingClub = await db.club.findUnique({
      where: { slug }
    })

    if (existingClub) {
      return NextResponse.json(
        { error: 'Club with this slug already exists' },
        { status: 400 }
      )
    }

    const club = await db.club.create({
      data: {
        name,
        slug,
        description,
        email,
        phone,
        address,
        church,
        district,
        conference,
        createdBy: user.userId
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ club }, { status: 201 })
  } catch (error) {
    console.error('Create club error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}