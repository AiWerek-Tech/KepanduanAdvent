import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { UserRole } from '@prisma/client'

// GET all events
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause: any = {}

    // Filter by target role
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MASTER_GUIDE') {
      whereClause.OR = [
        { targetRole: null }, // Events for all users
        { targetRole: session.user.role as UserRole } // Events for specific role
      ]
    }

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      
      whereClause.date = {
        gte: startDate,
        lte: endDate
      }
    }

    const events = await db.event.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new event (Admin/Master Guide only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to create events
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MASTER_GUIDE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, date, location, eventType, targetRole } = body

    if (!title || !date || !eventType) {
      return NextResponse.json(
        { error: 'Title, date, and event type are required' },
        { status: 400 }
      )
    }

    // Validate date
    const eventDate = new Date(date)
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Create event
    const event = await db.event.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        date: eventDate,
        location: location?.trim(),
        eventType: eventType.trim(),
        targetRole: targetRole || null,
        createdBy: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}