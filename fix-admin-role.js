const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function checkAndFixAdminRole() {
  try {
    console.log('🔍 Checking admin user role...');
    
    // Check current admin user
    const adminUser = await db.user.findUnique({
      where: { email: 'admin@kepanduan.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });
    
    console.log('Current admin user:');
    console.log(`- Email: ${adminUser?.email}`);
    console.log(`- Name: ${adminUser?.name}`);
    console.log(`- Role: ${adminUser?.role}`);
    console.log(`- Active: ${adminUser?.isActive}`);
    
    if (adminUser && adminUser.role !== 'ADMIN') {
      console.log('\n🔧 Fixing admin role...');
      
      // Update the role to ADMIN
      const updatedUser = await db.user.update({
        where: { email: 'admin@kepanduan.com' },
        data: { role: 'ADMIN' }
      });
      
      console.log('✅ Admin role updated successfully!');
      console.log(`- New role: ${updatedUser.role}`);
    } else if (adminUser && adminUser.role === 'ADMIN') {
      console.log('\n✅ Admin role is already correct!');
    } else {
      console.log('\n❌ Admin user not found!');
    }
    
    // Test login to verify
    console.log('\n🧪 Testing admin login...');
    const bcrypt = require('bcrypt');
    
    const testUser = await db.user.findUnique({
      where: { email: 'admin@kepanduan.com' }
    });
    
    if (testUser) {
      const isValidPassword = await bcrypt.compare('admin123', testUser.password);
      console.log(`Password valid: ${isValidPassword ? '✅' : '❌'}`);
      console.log(`Final role: ${testUser.role}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

checkAndFixAdminRole();