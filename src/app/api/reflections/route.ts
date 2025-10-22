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

// GET all reflections for logged-in user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId')

    let reflections
    if (materialId) {
      // Get reflections for specific material
      reflections = await db.reflection.findMany({
        where: {
          userId: user.userId,
          materialId
        },
        include: {
          material: {
            select: {
              id: true,
              title: true,
              category: true,
              classLevel: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Get all reflections for user
      reflections = await db.reflection.findMany({
        where: {
          userId: user.userId
        },
        include: {
          material: {
            select: {
              id: true,
              title: true,
              category: true,
              classLevel: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json(reflections)
  } catch (error) {
    console.error('Error fetching reflections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new reflection
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { materialId, content } = body

    if (!materialId || !content) {
      return NextResponse.json(
        { error: 'Material ID and content are required' },
        { status: 400 }
      )
    }

    // Check if material exists
    const material = await db.material.findUnique({
      where: { id: materialId }
    })

    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }

    // Create reflection
    const reflection = await db.reflection.create({
      data: {
        userId: user.userId,
        materialId,
        content: content.trim()
      },
      include: {
        material: {
          select: {
            id: true,
            title: true,
            category: true,
            classLevel: true
          }
        }
      }
    })

    return NextResponse.json(reflection, { status: 201 })
  } catch (error) {
    console.error('Error creating reflection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}