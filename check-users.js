const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const checkUsers = async () => {
  try {
    console.log('🔍 Checking existing users...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('📋 Existing users:')
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.name}`)
    })
    
    // Check if pathfinder user exists
    const pathfinderUser = users.find(u => u.role === 'PATHFINDER')
    if (!pathfinderUser) {
      console.log('❌ No PATHFINDER user found. Creating one...')
      
      const hashedPassword = await bcrypt.hash('password123', 10)
      
      const newUser = await prisma.user.create({
        data: {
          email: 'pathfinder@test.com',
          password: hashedPassword,
          name: 'Test Pathfinder',
          role: 'PATHFINDER'
        }
      })
      
      console.log('✅ Created PATHFINDER user:', newUser.email)
    } else {
      console.log('✅ PATHFINDER user found:', pathfinderUser.email)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()