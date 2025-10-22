import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { checkServerPermission } from '@/lib/roleGuard'

// GET /api/clubs/[id]/stats - Get club statistics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clubId = params.id

    // Check if user has permission to view club stats
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

    // Get current date for monthly calculations
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalMembers,
      activeMembers,
      totalActivities,
      upcomingActivities,
      totalPositions,
      newMembersThisMonth
    ] = await Promise.all([
      // Total members
      db.user.count({
        where: { 
          clubId,
          isActive: true 
        }
      }),
      
      // Active members (members with activity in last 30 days)
      db.user.count({
        where: { 
          clubId,
          isActive: true,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        }
      }),
      
      // Total activities
      db.activity.count({
        where: { clubId }
      }),
      
      // Upcoming activities
      db.activity.count({
        where: {
          clubId,
          startDate: {
            gte: now
          }
        }
      }),
      
      // Total positions
      db.clubPosition.count({
        where: { 
          clubId,
          isActive: true 
        }
      }),
      
      // New members this month
      db.user.count({
        where: {
          clubId,
          createdAt: {
            gte: firstDayOfMonth
          }
        }
      })
    ])

    const stats = {
      totalMembers,
      activeMembers,
      totalActivities,
      upcomingActivities,
      totalPositions,
      newMembersThisMonth
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Get club stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}