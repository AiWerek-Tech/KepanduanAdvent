import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const assignmentSchema = z.object({
  materialId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['READING', 'WRITING', 'PROJECT', 'PRESENTATION', 'PRACTICAL']),
  dueDate: z.string().optional(),
})

// GET assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId')
    
    const assignments = await db.assignment.findMany({
      where: {
        ...(materialId && { materialId }),
      },
      include: {
        material: {
          select: {
            id: true,
            title: true,
            classLevel: true,
          }
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        _count: {
          select: {
            submissions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Get assignments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { materialId, title, description, type, dueDate } = assignmentSchema.parse(body)
    
    const assignment = await db.assignment.create({
      data: {
        materialId,
        title,
        description,
        type,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        material: true,
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Create assignment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}