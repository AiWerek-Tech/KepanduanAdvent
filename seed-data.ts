import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample materials for Adventurer
  const adventurerMaterials = [
    {
      title: 'Pengenalan Alkitab untuk Anak',
      description: 'Belajar tentang Alkitab dengan cara yang menyenangkan',
      content: 'Alkitab adalah firman Allah yang berisi banyak sekali cerita menarik...',
      category: 'My God',
      classLevel: 'ADVENTURER',
      subClass: 'Little Lamb',
      order: 1,
      isRequired: true,
    },
    {
      title: 'Aku Anak Spesial',
      description: 'Mengenal betapa berharganya diri kita di mata Tuhan',
      content: 'Setiap anak adalah ciptaan Tuhan yang sangat istimewa...',
      category: 'My Self',
      classLevel: 'ADVENTURER',
      subClass: 'Little Lamb',
      order: 2,
      isRequired: true,
    },
    {
      title: 'Keluargaku Terkasih',
      description: 'Menghargai dan mencintai keluarga',
      content: 'Keluarga adalah anugerah terindah yang Tuhan berikan...',
      category: 'My Family',
      classLevel: 'ADVENTURER',
      subClass: 'Little Lamb',
      order: 3,
      isRequired: true,
    },
    {
      title: 'Ciptaan Tuhan yang Indah',
      description: 'Menikmati keindahan alam ciptaan Tuhan',
      content: 'Tuhan menciptakan dunia dengan sangat indah...',
      category: 'My World',
      classLevel: 'ADVENTURER',
      subClass: 'Little Lamb',
      order: 4,
      isRequired: true,
    },
  ]

  // Create sample materials for Pathfinder
  const pathfinderMaterials = [
    {
      title: 'Pertumbuhan Pribadi',
      description: 'Mengembangkan potensi diri sesuai kehendak Tuhan',
      content: 'Pertumbuhan pribadi adalah proses menjadi lebih baik setiap hari...',
      category: 'Personal Growth',
      classLevel: 'PATHFINDER',
      subClass: 'Friend',
      track: 'Personal Growth',
      order: 1,
      isRequired: true,
    },
    {
      title: 'Penemuan Spiritual',
      description: 'Mendalami hubungan pribadi dengan Tuhan',
      content: 'Hubungan dengan Tuhan adalah fondasi kehidupan rohani...',
      category: 'Spiritual Discovery',
      classLevel: 'PATHFINDER',
      subClass: 'Friend',
      track: 'Spiritual Discovery',
      order: 2,
      isRequired: true,
    },
    {
      title: 'Melayani Sesama',
      description: 'Praktik pelayanan dalam kehidupan sehari-hari',
      content: 'Melayani sesama adalah wujud kasih dalam tindakan...',
      category: 'Serving Others',
      classLevel: 'PATHFINDER',
      subClass: 'Friend',
      track: 'Serving Others',
      order: 3,
      isRequired: true,
    },
  ]

  // Create sample materials for Master Guide
  const masterGuideMaterials = [
    {
      title: 'Identitas Kepemimpinan',
      description: 'Memahami panggilan dan identitas sebagai pemimpin',
      content: 'Kepemimpinan adalah panggilan untuk melayani dan membimbing...',
      category: 'Leadership Identity & Growth',
      classLevel: 'MASTER_GUIDE',
      subClass: 'Leadership Identity',
      order: 1,
      isRequired: true,
    },
    {
      title: 'Pengembangan Gaya Hidup',
      description: 'Membangun gaya hidup yang menjadi teladan',
      content: 'Gaya hidup seorang pemimpin mencerminkan nilai-nilai yang dianut...',
      category: 'Lifestyle Development',
      classLevel: 'MASTER_GUIDE',
      subClass: 'Lifestyle Development',
      order: 2,
      isRequired: true,
    },
  ]

  // Insert materials
  for (const material of adventurerMaterials) {
    await prisma.material.create({
      data: material,
    })
  }

  for (const material of pathfinderMaterials) {
    await prisma.material.create({
      data: material,
    })
  }

  for (const material of masterGuideMaterials) {
    await prisma.material.create({
      data: material,
    })
  }

  console.log('Sample materials created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })