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

// GET /api/materials - Get materials (with role-based filtering)
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const classLevel = searchParams.get('classLevel')
    const search = searchParams.get('search')

    let whereClause: any = {}

    if (category && category !== 'all') {
      whereClause.category = category
    }

    if (classLevel && classLevel !== 'all') {
      whereClause.classLevel = classLevel
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    }

    const materials = await db.material.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            reflections: true,
            progress: true
          }
        }
      },
      orderBy: [
        { classLevel: 'asc' },
        { category: 'asc' },
        { title: 'asc' }
      ]
    })

    // Transform materials to include additional info
    const materialsWithStats = materials.map(material => ({
      ...material,
      stats: {
        totalReflections: material._count.reflections,
        totalProgress: material._count.progress,
        completionRate: material._count.progress > 0 
          ? Math.round((material._count.progress / 10) * 100) // Assuming 10 lessons per material
          : 0
      }
    }))

    return NextResponse.json({
      materials: materialsWithStats,
      total: materialsWithStats.length
    })

  } catch (error) {
    console.error('Get materials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/materials - Create new material (Admin/Master Guide only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId || !['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      category, 
      classLevel, 
      content, 
      duration,
      objectives,
      requirements 
    } = body

    if (!title || !category || !classLevel) {
      return NextResponse.json(
        { error: 'Title, category, and class level are required' },
        { status: 400 }
      )
    }

    // Create material
    const material = await db.material.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        category,
        classLevel,
        content: content?.trim() || '',
        duration: duration || 60,
        objectives: objectives || [],
        requirements: requirements || [],
        createdBy: user.userId
      }
    })

    return NextResponse.json({ material }, { status: 201 })

  } catch (error) {
    console.error('Create material error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}