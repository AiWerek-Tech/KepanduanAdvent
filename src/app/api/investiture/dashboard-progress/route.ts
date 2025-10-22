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

    // Get all chapters with requirements
    const chapters = await db.investitureChapter.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        requirements: {
          where: {
            isActive: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Get user progress for all chapters
    const userProgress = await db.investitureUserProgress.findMany({
      where: {
        userId: dbUser.id
      }
    })

    // Create a map of requirement progress
    const progressMap = new Map()
    userProgress.forEach(progress => {
      progressMap.set(progress.requirementId, {
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt
      })
    })

    // Calculate progress for each chapter
    const chaptersWithProgress = chapters.map(chapter => {
      const totalRequirements = chapter.requirements.length
      const completedRequirements = chapter.requirements.filter(req => 
        progressMap.get(req.id)?.isCompleted
      ).length
      
      const progressPercentage = totalRequirements > 0 
        ? Math.round((completedRequirements / totalRequirements) * 100)
        : 0

      return {
        id: chapter.id,
        name: chapter.nameID,
        nameEN: chapter.nameEN,
        icon: chapter.iconUrl,
        progress: progressPercentage,
        color: chapter.color,
        totalRequirements,
        completedRequirements
      }
    })

    // Calculate overall progress
    const totalAllRequirements = chaptersWithProgress.reduce((sum, ch) => sum + ch.totalRequirements, 0)
    const totalAllCompleted = chaptersWithProgress.reduce((sum, ch) => sum + ch.completedRequirements, 0)
    const overallProgress = totalAllRequirements > 0 
      ? Math.round((totalAllCompleted / totalAllRequirements) * 100)
      : 0

    return NextResponse.json({
      chapters: chaptersWithProgress,
      overallProgress,
      totalChapters: chapters.length,
      totalRequirements: totalAllRequirements,
      totalCompleted: totalAllCompleted
    })
  } catch (error) {
    console.error('Error fetching dashboard progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}