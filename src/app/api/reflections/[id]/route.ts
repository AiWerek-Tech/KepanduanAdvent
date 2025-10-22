import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// DELETE - Hapus refleksi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(request)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reflectionId = params.id

    // Cek apakah refleksi milik user
    const reflection = await db.reflection.findFirst({
      where: {
        id: reflectionId,
        userId: session.user.id
      }
    })

    if (!reflection) {
      return NextResponse.json(
        { error: 'Reflection not found' },
        { status: 404 }
      )
    }

    // Hapus refleksi
    await db.reflection.delete({
      where: { id: reflectionId }
    })

    return NextResponse.json({
      success: true,
      message: 'Refleksi berhasil dihapus'
    })

  } catch (error) {
    console.error('Error deleting reflection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}