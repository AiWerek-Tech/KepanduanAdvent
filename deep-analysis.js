const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const deepAnalysis = async () => {
  try {
    console.log('🔍 DEEP ANALYSIS - User Authentication Issues')
    console.log('=' .repeat(60))
    
    // 1. Check all users
    console.log('\n📋 1. ALL USERS IN DATABASE:')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   ID: ${user.id}`)
      console.log('')
    })
    
    // 2. Test password for each user
    console.log('🔐 2. PASSWORD VERIFICATION TEST:')
    for (const user of users) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      console.log(`\nTesting ${user.email} (${user.role}):`)
      
      // Test common passwords
      const passwords = ['password123', 'password', 'admin', '123456']
      for (const pwd of passwords) {
        try {
          const isValid = await bcrypt.compare(pwd, fullUser.password)
          if (isValid) {
            console.log(`  ✅ Password "${pwd}" WORKS`)
          }
        } catch (error) {
          console.log(`  ❌ Error testing password: ${error.message}`)
        }
      }
    }
    
    // 3. Check if passwords are properly hashed
    console.log('\n🔒 3. PASSWORD HASH ANALYSIS:')
    for (const user of users) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      console.log(`\n${user.email}:`)
      console.log(`  Hash length: ${fullUser.password.length}`)
      console.log(`  Hash starts with: ${fullUser.password.substring(0, 10)}...`)
      
      // Check if it's a bcrypt hash
      const isBcrypt = fullUser.password.startsWith('$2')
      console.log(`  Is bcrypt: ${isBcrypt}`)
    }
    
    // 4. Fix passwords if needed
    console.log('\n🔧 4. FIXING PASSWORDS:')
    for (const user of users) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      // Check if password is properly hashed
      if (!fullUser.password.startsWith('$2')) {
        console.log(`Fixing password for ${user.email}...`)
        const hashedPassword = await bcrypt.hash('password123', 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
        console.log(`✅ Password fixed for ${user.email}`)
      } else {
        // Test if current password works
        const isValid = await bcrypt.compare('password123', fullUser.password)
        if (!isValid) {
          console.log(`Updating password for ${user.email}...`)
          const hashedPassword = await bcrypt.hash('password123', 10)
          await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
          })
          console.log(`✅ Password updated for ${user.email}`)
        } else {
          console.log(`✅ Password OK for ${user.email}`)
        }
      }
    }
    
    console.log('\n🎯 5. FINAL VERIFICATION:')
    for (const user of users) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      const isValid = await bcrypt.compare('password123', fullUser.password)
      console.log(`${user.email} (${user.role}): ${isValid ? '✅ LOGIN READY' : '❌ BROKEN'}`)
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

deepAnalysis()