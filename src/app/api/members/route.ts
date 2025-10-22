import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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

// GET /api/members - Get members (with role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')
    const role = searchParams.get('role')

    let whereClause: any = {}

    // Filter based on user role
    if (user.role === 'ADMIN') {
      // Admin can see all members
      if (clubId) whereClause.clubId = clubId
      if (role) whereClause.role = role
    } else if (user.role === 'MASTER_GUIDE') {
      // Master Guide can see members of their club
      whereClause.clubId = user.clubId
      if (role) whereClause.role = role
    } else {
      // Other users can only see themselves
      whereClause.id = user.userId
    }

    const members = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        church: true,
        district: true,
        conference: true,
        isActive: true,
        createdAt: true,
        club: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Get members error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/members - Create new member (Admin/Master Guide only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password, role, phone, church, district, conference, clubId } = body

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine club ID
    let memberClubId = clubId
    if (!memberClubId && user.role !== 'ADMIN') {
      memberClubId = user.clubId
    }

    const member = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        church,
        district,
        conference,
        clubId: memberClubId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        church: true,
        district: true,
        conference: true,
        isActive: true,
        createdAt: true,
        club: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('Create member error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}