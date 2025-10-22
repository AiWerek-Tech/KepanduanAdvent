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

// GET /api/progress - Get progress data
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const materialId = searchParams.get('materialId')
    const all = searchParams.get('all')

    let whereClause: any = {}

    // Admin and Master Guide can see all progress
    if (all === 'true' && ['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      if (userId) whereClause.userId = userId
      if (materialId) whereClause.materialId = materialId
    } else {
      // Regular users can only see their own progress
      whereClause.userId = user.userId
      if (materialId) whereClause.materialId = materialId
    }

    const progress = await db.progress.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
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
        updatedAt: 'desc'
      }
    })

    // Calculate statistics
    const stats = {
      total: progress.length,
      completed: progress.filter(p => p.status === 'COMPLETED').length,
      inProgress: progress.filter(p => p.status === 'IN_PROGRESS').length,
      notStarted: progress.filter(p => p.status === 'NOT_STARTED').length,
      averageCompletion: progress.length > 0 
        ? Math.round(progress.reduce((acc, p) => acc + p.completionPercentage, 0) / progress.length)
        : 0
    }

    return NextResponse.json({
      success: true,
      progress,
      stats
    })

  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Create or update progress
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { materialId, status, completionPercentage, notes, lessonsCompleted } = body

    if (!materialId) {
      return NextResponse.json(
        { error: 'Material ID is required' },
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

    // Check if progress already exists
    const existingProgress = await db.progress.findFirst({
      where: {
        userId: user.userId,
        materialId
      }
    })

    let progress

    if (existingProgress) {
      // Update existing progress
      progress = await db.progress.update({
        where: { id: existingProgress.id },
        data: {
          status: status || existingProgress.status,
          completionPercentage: completionPercentage !== undefined ? completionPercentage : existingProgress.completionPercentage,
          notes: notes || existingProgress.notes,
          lessonsCompleted: lessonsCompleted || existingProgress.lessonsCompleted,
          updatedAt: new Date()
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
    } else {
      // Create new progress
      progress = await db.progress.create({
        data: {
          userId: user.userId,
          materialId,
          status: status || 'NOT_STARTED',
          completionPercentage: completionPercentage || 0,
          notes: notes || '',
          lessonsCompleted: lessonsCompleted || []
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
    }

    return NextResponse.json({
      success: true,
      progress
    }, { status: 201 })

  } catch (error) {
    console.error('Create/Update progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/progress - Update progress (alternative to POST)
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, completionPercentage, notes, lessonsCompleted } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Progress ID is required' },
        { status: 400 }
      )
    }

    // Check if progress exists and belongs to user (or admin)
    const existingProgress = await db.progress.findFirst({
      where: {
        id,
        ...(user.role !== 'ADMIN' && user.role !== 'MASTER_GUIDE' && { userId: user.userId })
      }
    })

    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      )
    }

    const progress = await db.progress.update({
      where: { id },
      data: {
        status: status || existingProgress.status,
        completionPercentage: completionPercentage !== undefined ? completionPercentage : existingProgress.completionPercentage,
        notes: notes || existingProgress.notes,
        lessonsCompleted: lessonsCompleted || existingProgress.lessonsCompleted,
        updatedAt: new Date()
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

    return NextResponse.json({
      success: true,
      progress
    })

  } catch (error) {
    console.error('Update progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}