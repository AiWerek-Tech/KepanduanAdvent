import { PrismaClient } from '@prisma/client'
import { generateToken } from '../src/lib/auth'

const prisma = new PrismaClient()

export async function createTestUser() {
  try {
    console.log('👤 Creating test Pathfinder user...')

    // Check if test user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'pathfinder@test.com' }
    })

    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email)
      return existingUser
    }

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'pathfinder@test.com',
        name: 'Alexandra Putri',
        password: 'password123', // In production, this should be hashed
        role: 'PATHFINDER',
        isActive: true
      }
    })

    console.log('✅ Test user created:', testUser.email)
    
    // Generate token for testing
    const token = generateToken({
      id: testUser.id,
      email: testUser.email,
      role: testUser.role
    })

    console.log('🔑 Test token:', token)
    console.log('📝 Use this token in browser cookies as "token"')
    
    return testUser
    
  } catch (error) {
    console.error('❌ Error creating test user:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  createTestUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}