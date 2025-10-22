const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const testPassword = async () => {
  try {
    console.log('🔐 Testing password...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'pathfinder@kepanduan.com' }
    })
    
    if (user) {
      console.log('👤 User found:', user.email, 'Role:', user.role)
      
      // Test password verification
      const isValid = await bcrypt.compare('password123', user.password)
      console.log('✅ Password verification (password123):', isValid)
      
      const isValid2 = await bcrypt.compare('password', user.password)
      console.log('✅ Password verification (password):', isValid2)
      
      // Update password if needed
      if (!isValid) {
        console.log('🔄 Updating password...')
        const newHashedPassword = await bcrypt.hash('password123', 10)
        await prisma.user.update({
          where: { email: 'pathfinder@kepanduan.com' },
          data: { password: newHashedPassword }
        })
        console.log('✅ Password updated')
      }
    } else {
      console.log('❌ User not found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testPassword()