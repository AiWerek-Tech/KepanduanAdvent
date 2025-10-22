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

// POST /api/materials/seed - Seed sample materials (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user?.userId || !['ADMIN', 'MASTER_GUIDE'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sample materials for different categories and levels
    const sampleMaterials = [
      // Adventurer Materials
      {
        title: "Allah Menciptakan Dunia",
        description: "Pelajaran tentang penciptaan alam semesta",
        category: "IBADAH",
        classLevel: "MINI",
        content: "Pada awalnya Allah menciptakan langit dan bumi...",
        duration: 45,
        objectives: ["Memahami penciptaan", "Menghargai alam", "Meyakini kekuasaan Allah"],
        requirements: ["Alkitab", "Kertas gambar", "Pewarna"],
        createdBy: user.userId
      },
      {
        title: "Kasih dalam Keluarga",
        description: "Belajar tentang kasih dan pengorbanan",
        category: "Karakter",
        classLevel: "MINI",
        content: "Kasih adalah sabar, kasih adalah murah hati...",
        duration: 30,
        objectives: ["Memahami arti kasih", "Mengasihi keluarga", "Menunjukkan kasih"],
        requirements: ["Alkitab", "Kertas", "Pensil"],
        createdBy: user.userId
      },
      {
        title: "Doa Sehari-hari",
        description: "Mempraktikkan doa dalam kehidupan sehari-hari",
        category: "IBADAH",
        classLevel: "BASIC",
        content: "Berdoalah tanpa henti, bersyukurlah dalam segala hal...",
        duration: 60,
        objectives: ["Memahami pentingnya doa", "Belajar berdoa", "Membiasakan doa"],
        requirements: ["Alkitab", "Buku doa", "Jurnal"],
        createdBy: user.userId
      },
      {
        title: "Kepemimpinan Daud",
        description: "Belajar kepemimpinan dari Raja Daud",
        category: "KEPEMIMPINAN",
        classLevel: "BASIC",
        content: "Daud adalah gembala yang menjadi raja...",
        duration: 90,
        objectives: ["Memahami kepemimpinan", "Meneladani Daud", "Mengembangkan leadership"],
        requirements: ["Alkitab", "Buku cerita", "Laptop"],
        createdBy: user.userId
      },
      // Pathfinder Materials
      {
        title: "Pelayanan Masyarakat",
        description: "Melayani sesama dengan kasih",
        category: "Pelayanan",
        classLevel: "ADVANCED",
        content: "Siapapun yang ingin menjadi besar di antara kamu...",
        duration: 120,
        objectives: ["Memahami pelayanan", "Melayani masyarakat", "Mengembangkan empati"],
        requirements: ["Alkitab", "Proposal", "Transportasi"],
        createdBy: user.userId
      },
      {
        title: "Keterampilan Bertahan Hidup",
        description: "Belajar survival di alam",
        category: "Keterampilan",
        classLevel: "ADVANCED",
        content: "Keterampilan bertahan hidup penting untuk petualangan...",
        duration: 180,
        objectives: ["Survival skills", "Orientasi", "First aid"],
        requirements: ["Peta", "Kompas", "P3K"],
        createdBy: user.userId
      },
      {
        title: "Spiritual Discovery",
        description: "Menemukan makna spiritual dalam kehidupan",
        category: "IBADAH",
        classLevel: "MASTER",
        content: "Pencarian spiritual adalah perjalanan seumur hidup...",
        duration: 150,
        objectives: ["Pemahaman spiritual", "Hubungan dengan Tuhan", "Pertumbuhan iman"],
        requirements: ["Alkitab", "Buku spiritual", "Jurnal refleksi"],
        createdBy: user.userId
      },
      {
        title: "Advanced Leadership",
        description: "Kepemimpinan tingkat lanjut",
        category: "KEPEMIMPINAN",
        classLevel: "MASTER",
        content: "Kepemimpinan yang efektif memerlukan pembelajaran berkelanjutan...",
        duration: 200,
        objectives: ["Strategic thinking", "Team building", "Conflict resolution"],
        requirements: ["Leadership books", "Case studies", "Presentation tools"],
        createdBy: user.userId
      }
    ]

    // Clear existing materials (optional)
    await db.material.deleteMany()

    // Insert sample materials
    const createdMaterials = await db.material.createMany({
      data: sampleMaterials,
      skipDuplicates: true
    })

    return NextResponse.json({
      message: 'Sample materials seeded successfully',
      count: createdMaterials.count,
      materials: sampleMaterials
    })

  } catch (error) {
    console.error('Seed materials error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}