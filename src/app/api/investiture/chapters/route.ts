import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
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

    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nameEN, nameID, description, iconUrl, color, order } = body

    const chapter = await db.investitureChapter.create({
      data: {
        nameEN,
        nameID,
        description,
        iconUrl,
        color,
        order
      }
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    )
  }
}