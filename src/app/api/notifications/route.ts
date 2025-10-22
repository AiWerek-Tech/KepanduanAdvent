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

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    let whereClause: any = {
      userId: user.userId
    }

    if (unreadOnly) {
      whereClause.isRead = false
    }

    const notifications = await db.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Get unread count
    const unreadCount = await db.notification.count({
      where: {
        userId: user.userId,
        isRead: false
      }
    })

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification (Admin/Master Guide only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    
    if (!user?.userId || !['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      message, 
      type, 
      targetUserId, 
      targetRole, 
      targetClubId,
      actionUrl 
    } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'Title, message, and type are required' },
        { status: 400 }
      )
    }

    // Determine target users
    let targetUsers: any[] = []

    if (targetUserId) {
      // Specific user
      targetUsers = [{ id: targetUserId }]
    } else if (targetRole) {
      // All users with specific role
      targetUsers = await db.user.findMany({
        where: {
          role: targetRole,
          isActive: true,
          ...(targetClubId && { clubId: targetClubId })
        },
        select: { id: true }
      })
    } else if (targetClubId) {
      // All users in specific club
      targetUsers = await db.user.findMany({
        where: {
          clubId: targetClubId,
          isActive: true
        },
        select: { id: true }
      })
    } else {
      // All active users (Admin only)
      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Only admins can send notifications to all users' },
          { status: 403 }
        )
      }
      targetUsers = await db.user.findMany({
        where: {
          isActive: true
        },
        select: { id: true }
      })
    }

    // Create notifications for all target users
    const notifications = await Promise.all(
      targetUsers.map(targetUser =>
        db.notification.create({
          data: {
            userId: targetUser.id,
            title,
            message,
            type,
            actionUrl: actionUrl || null,
            createdBy: user.userId
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length
    }, { status: 201 })

  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAll } = body

    if (markAll) {
      // Mark all notifications as read
      await db.notification.updateMany({
        where: {
          userId: user.userId,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      })
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await db.notification.updateMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: user.userId
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Notifications marked as read'
      })
    } else {
      return NextResponse.json(
        { error: 'Either notificationIds or markAll is required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Update notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')

    if (notificationId) {
      // Delete specific notification
      const notification = await db.notification.findFirst({
        where: {
          id: notificationId,
          userId: user.userId
        }
      })

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        )
      }

      await db.notification.delete({
        where: { id: notificationId }
      })

      return NextResponse.json({
        success: true,
        message: 'Notification deleted'
      })
    } else {
      // Delete all read notifications
      await db.notification.deleteMany({
        where: {
          userId: user.userId,
          isRead: true
        }
      })

      return NextResponse.json({
        success: true,
        message: 'All read notifications deleted'
      })
    }

  } catch (error) {
    console.error('Delete notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}