const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

async function testProduction() {
  console.log('🧪 Testing Production Environment...');
  
  // Test database connection
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'file:/home/z/my-project/db/custom.db'
        }
      }
    });
    
    console.log('✅ Database connection successful');
    
    // Test user query
    const user = await prisma.user.findUnique({
      where: { email: 'admin@kepanduan.com' }
    });
    
    if (user) {
      console.log('✅ Admin user found:', user.email, user.role);
      
      // Test password verification
      const isValid = await bcrypt.compare('admin123', user.password);
      console.log('✅ Password verification:', isValid);
      
      // Test JWT generation
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'kepanduan-club-jwt-secret-key-2024-production-secure',
        { expiresIn: '7d' }
      );
      console.log('✅ JWT token generated:', token.substring(0, 50) + '...');
      
      // Test JWT verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kepanduan-club-jwt-secret-key-2024-production-secure');
      console.log('✅ JWT verification successful:', decoded.email);
      
    } else {
      console.log('❌ Admin user not found');
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
  
  console.log('🔧 Environment variables:');
  console.log('   NODE_ENV:', process.env.NODE_ENV);
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('   DATABASE_URL:', process.env.DATABASE_URL);
  console.log('   Working directory:', process.cwd());
}

testProduction();