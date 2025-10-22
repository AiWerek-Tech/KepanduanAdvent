import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const submissionSchema = z.object({
  assignmentId: z.string(),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
})

// GET submissions
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('assignmentId')
    
    const submissions = await db.assignmentSubmission.findMany({
      where: {
        ...(userId && { userId }),
        ...(assignmentId && { assignmentId }),
      },
      include: {
        assignment: {
          include: {
            material: {
              select: {
                id: true,
                title: true,
                classLevel: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST submission
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { assignmentId, content, fileUrl } = submissionSchema.parse(body)
    
    const submission = await db.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        content,
        fileUrl,
      },
      include: {
        assignment: {
          include: {
            material: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Create submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}