import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding default data...')

  // Create default admin user first
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@kepanduan.com',
      name: 'Admin Kepanduan',
      password: hashedPassword,
      role: 'ADMIN',
      church: 'GMAHK Pusat',
      district: 'Jakarta',
      conference: 'Konferens Indonesia',
    },
  })

  console.log('Created admin user:', adminUser)

  // Create club with valid createdBy
  const club = await prisma.club.create({
    data: {
      name: 'Kepanduan Advent Indonesia',
      slug: 'kepanduan-advent-indonesia',
      description: 'Klub Kepanduan Advent resmi untuk Indonesia',
      email: 'info@kepanduan-advent.id',
      phone: '+62-21-1234567',
      address: 'Jl. Advent No. 123, Jakarta',
      church: 'Gereja Masehi Advent Hari Ketujuh Indonesia',
      district: 'Jakarta',
      conference: 'Konferens Indonesia Barat',
      isActive: true,
      createdBy: adminUser.id,
    },
  })

  console.log('Created club:', club)

  // Create Master Guide user
  const mgPassword = await bcrypt.hash('masterguide123', 10)

  const masterGuideUser = await prisma.user.create({
    data: {
      email: 'masterguide@kepanduan.com',
      name: 'Master Guide John',
      password: mgPassword,
      role: 'MASTER_GUIDE',
      phone: '+62-812-3456-7890',
      church: 'GMAHK Jakarta Central',
      district: 'Jakarta',
      conference: 'Konferens Indonesia Barat',
      clubId: club.id,
    },
  })

  console.log('Created master guide user:', masterGuideUser)

  // Create test adventurer user
  const adventurerPassword = await bcrypt.hash('adventurer123', 10)

  const adventurerUser = await prisma.user.create({
    data: {
      email: 'adventurer@kepanduan.com',
      name: 'Adventurer User',
      password: adventurerPassword,
      role: 'ADVENTURER',
      church: 'GMAHK Jakarta Central',
      district: 'Jakarta',
      conference: 'Konferens Indonesia Barat',
      clubId: club.id,
    },
  })

  console.log('Created adventurer user:', adventurerUser)

  // Create test pathfinder user
  const pathfinderPassword = await bcrypt.hash('pathfinder123', 10)

  const pathfinderUser = await prisma.user.create({
    data: {
      email: 'pathfinder@kepanduan.com',
      name: 'Pathfinder User',
      password: pathfinderPassword,
      role: 'PATHFINDER',
      church: 'GMAHK Jakarta Central',
      district: 'Jakarta',
      conference: 'Konferens Indonesia Barat',
      clubId: club.id,
    },
  })

  console.log('Created pathfinder user:', pathfinderUser)

  // Create sample activity
  const activity = await prisma.activity.create({
    data: {
      clubId: club.id,
      title: 'Kemah Tahunan 2024',
      description: 'Kemah tahunan untuk semua anggota Kepanduan Advent',
      category: 'CAMP',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-17'),
      location: 'Bumi Perkemahan Cibubur',
      status: 'upcoming',
      createdBy: masterGuideUser.id,
    },
  })

  console.log('Created sample activity:', activity)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })