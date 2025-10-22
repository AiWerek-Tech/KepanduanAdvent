import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedInvestitureData() {
  try {
    console.log('🌱 Seeding Investiture Achievement data...')

    // Define chapters with their requirements
    const chaptersData = [
      {
        nameEN: 'Personal Growth',
        nameID: 'Pertumbuhan Pribadi',
        description: 'Mengembangkan karakter dan kemampuan diri',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-blue-500 to-cyan-500',
        order: 1,
        requirements: [
          'Berada di Kelas 5 atau sederajat',
          'Kembangkan kehidupan rohanimu setiap hari dengan mempelajari Panduan Renungan Sepekan (Pekan 1–13) dan kitab Matius, menggunakan sumber cetak maupun digital',
          'Tuliskan refleksimu dengan menjawab pertanyaan berikut: Apa yang saya pelajari tentang Allah? Apa yang saya pelajari tentang diri saya sendiri? Bagaimana saya dapat menerapkannya dalam hidup saya hari ini? (Refleksi dapat dibuat dalam bentuk tulisan, gambar, atau digital)',
          'Hafalkan Perjanjian dan Peraturan Pathfinder',
          'Pelajari Mars Pathfinder'
        ]
      },
      {
        nameEN: 'Spiritual Discovery',
        nameID: 'Penemuan Spiritual',
        description: 'Mendalami hubungan dengan Tuhan',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-purple-500 to-pink-500',
        order: 2,
        requirements: [
          'Pelajari tentang hubungan pribadi dengan Tuhan',
          'Ikuti kegiatan devosi harian',
          'Tulis jurnal spiritual',
          'Berpartisipasi dalam kegiatan gereja',
          'Pelajari ayat-ayat Alkitab pilihan'
        ]
      },
      {
        nameEN: 'Serving Others',
        nameID: 'Melayani Orang Lain',
        description: 'Belajar melayani dengan kasih',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-green-500 to-emerald-500',
        order: 3,
        requirements: [
          'Ikuti kegiatan pelayanan di komunitas',
          'Bantu orang yang membutuhkan',
          'Ikuti program sosial Pathfinder',
          'Lakukan aksi kasih tanpa pamrih'
        ]
      },
      {
        nameEN: 'Making Friends',
        nameID: 'Berteman',
        description: 'Membangun persahabatan yang sehat',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-yellow-500 to-orange-500',
        order: 4,
        requirements: [
          'Kenali semua anggota klub',
          'Pelajari cara berteman yang baik',
          'Ikuti kegiatan tim building',
          'Bantu teman yang kesulitan'
        ]
      },
      {
        nameEN: 'Health and Fitness',
        nameID: 'Kesehatan dan Kebugaran',
        description: 'Menjaga kesehatan tubuh dan jiwa',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-red-500 to-rose-500',
        order: 5,
        requirements: [
          'Lakukan olahraga rutin 3x seminggu',
          'Pelajari tentang gizi seimbang',
          'Ikuti tes kesehatan dasar',
          'Jaga kebersihan diri',
          'Pelajari tentang pertolongan pertama'
        ]
      },
      {
        nameEN: 'Nature Study',
        nameID: 'Studi Alam',
        description: 'Mempelajari keindahan ciptaan Tuhan',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-teal-500 to-cyan-500',
        order: 6,
        requirements: [
          'Identifikasi 10 jenis tumbuhan lokal',
          'Pelajari tentang ekosistem',
          'Ikuti kegiatan pelestarian alam',
          'Buat jurnal pengamatan alam',
          'Pelajari tentang cuaca dan iklim'
        ]
      },
      {
        nameEN: 'Outdoor Living',
        nameID: 'Kehidupan Luar Ruangan',
        description: 'Belajar bertahan di alam',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-indigo-500 to-purple-500',
        order: 7,
        requirements: [
          'Ikuti kemah minimal 2 malam',
          'Pelajari cara membuat api',
          'Praktik navigasi dengan kompas',
          'Pelajari teknik bertahan di alam',
          'Ikuti hiking minimal 5km'
        ]
      },
      {
        nameEN: 'Honor Enrichment',
        nameID: 'Pengayaan Kehormatan',
        description: 'Mengembangkan keterampilan khusus',
        iconUrl: 'https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png',
        color: 'from-amber-500 to-yellow-500',
        order: 8,
        requirements: [
          'Selesaikan minimal 2 honor Pathfinder',
          'Pelajari keterampilan baru',
          'Presentasikan hasil belajar',
          'Bantu teman lain belajar'
        ]
      }
    ]

    // Insert chapters and requirements
    for (const chapterData of chaptersData) {
      // Check if chapter already exists by nameEN
      const existingChapter = await prisma.investitureChapter.findFirst({
        where: { nameEN: chapterData.nameEN }
      })

      let chapter
      if (existingChapter) {
        // Update existing chapter
        chapter = await prisma.investitureChapter.update({
          where: { id: existingChapter.id },
          data: {
            nameID: chapterData.nameID,
            description: chapterData.description,
            iconUrl: chapterData.iconUrl,
            color: chapterData.color,
            order: chapterData.order
          }
        })
      } else {
        // Create new chapter
        chapter = await prisma.investitureChapter.create({
          data: {
            nameEN: chapterData.nameEN,
            nameID: chapterData.nameID,
            description: chapterData.description,
            iconUrl: chapterData.iconUrl,
            color: chapterData.color,
            order: chapterData.order
          }
        })
      }

      console.log(`✅ Chapter: ${chapter.nameID}`)

      // Insert requirements for this chapter
      for (let i = 0; i < chapterData.requirements.length; i++) {
        const requirementText = chapterData.requirements[i]
        
        // Check if requirement already exists
        const existingRequirement = await prisma.investitureRequirement.findFirst({
          where: {
            chapterId: chapter.id,
            order: i + 1
          }
        })

        if (existingRequirement) {
          // Update existing requirement
          await prisma.investitureRequirement.update({
            where: { id: existingRequirement.id },
            data: {
              requirement: requirementText
            }
          })
        } else {
          // Create new requirement
          await prisma.investitureRequirement.create({
            data: {
              chapterId: chapter.id,
              requirement: requirementText,
              order: i + 1
            }
          })
        }
      }

      console.log(`  ✅ Added ${chapterData.requirements.length} requirements`)
    }

    console.log('🎉 Investiture Achievement data seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding Investiture data:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedInvestitureData()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}