import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: { email: user.user.email }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user progress for all chapters
    const userProgress = await db.investitureUserProgress.findMany({
      where: {
        userId: dbUser.id
      },
      include: {
        requirement: {
          include: {
            chapter: true
          }
        }
      }
    })

    // Group progress by chapter
    const progressByChapter: Record<string, any[]> = {}
    userProgress.forEach(progress => {
      const chapterId = progress.requirement.chapterId
      if (!progressByChapter[chapterId]) {
        progressByChapter[chapterId] = []
      }
      progressByChapter[chapterId].push({
        id: progress.requirementId,
        text: progress.requirement.requirement,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
        mentorNotes: progress.mentorNotes,
        isValidated: progress.isValidated
      })
    })

    return NextResponse.json(progressByChapter)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await db.user.findUnique({
      where: { email: user.user.email }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { requirementId, isCompleted } = body

    if (!requirementId || typeof isCompleted !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Get requirement details
    const requirement = await db.investitureRequirement.findUnique({
      where: { id: requirementId },
      include: { chapter: true }
    })

    if (!requirement) {
      return NextResponse.json(
        { error: 'Requirement not found' },
        { status: 404 }
      )
    }

    // Update or create progress record
    const progress = await db.investitureUserProgress.upsert({
      where: {
        userId_requirementId: {
          userId: dbUser.id,
          requirementId
        }
      },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId: dbUser.id,
        chapterId: requirement.chapterId,
        requirementId,
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      }
    })

    console.log(`✅ Progress updated: User ${dbUser.email}, Requirement ${requirementId}, Completed: ${isCompleted}`)

    return NextResponse.json({
      success: true,
      data: progress,
      message: `Persyaratan berhasil ${isCompleted ? 'dicentang' : 'dibatalkan'}`
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress', details: error.message },
      { status: 500 }
    )
  }
}