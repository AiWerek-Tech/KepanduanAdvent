// Final comprehensive test
const finalTest = async () => {
  console.log('🎯 FINAL COMPREHENSIVE TEST')
  console.log('================================')
  
  const accounts = [
    { email: 'admin@kepanduan.com', password: 'admin123', role: 'ADMIN' },
    { email: 'masterguide@kepanduan.com', password: 'masterguide123', role: 'MASTER_GUIDE' },
    { email: 'adventurer@kepanduan.com', password: 'adventurer123', role: 'ADVENTURER' },
    { email: 'pathfinder@kepanduan.com', password: 'pathfinder123', role: 'PATHFINDER' }
  ]

  let allPassed = true

  for (const account of accounts) {
    console.log(`\\n🔐 Testing ${account.role}: ${account.email}`)
    console.log('----------------------------------------')
    
    try {
      // Step 1: Login
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      })
      
      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.status}`)
      }
      
      const loginData = await loginResponse.json()
      console.log('✅ Login successful')
      
      // Extract token
      const setCookieHeader = loginResponse.headers.get('set-cookie')
      const tokenMatch = setCookieHeader?.match(/token=([^;]+)/)
      const token = tokenMatch ? tokenMatch[1] : null
      
      if (!token) {
        throw new Error('No token found')
      }
      
      // Step 2: Test dashboard access
      const dashboardResponse = await fetch('http://localhost:3000/dashboard', {
        headers: { 'Cookie': `token=${token}` },
        redirect: 'manual'
      })
      
      if (dashboardResponse.status === 200) {
        console.log('✅ Dashboard accessible')
      } else {
        console.log(`❌ Dashboard failed: ${dashboardResponse.status}`)
        allPassed = false
        continue
      }
      
      // Step 3: Test auth me API
      const meResponse = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Cookie': `token=${token}` }
      })
      
      if (meResponse.ok) {
        const meData = await meResponse.json()
        console.log(`✅ Auth me successful: ${meData.user.role}`)
      } else {
        console.log(`❌ Auth me failed: ${meResponse.status}`)
        allPassed = false
        continue
      }
      
      // Step 4: Logout
      const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { 'Cookie': `token=${token}` }
      })
      
      if (logoutResponse.ok) {
        console.log('✅ Logout successful')
      } else {
        console.log(`❌ Logout failed: ${logoutResponse.status}`)
        allPassed = false
      }
      
      console.log(`🎉 ${account.role} test PASSED`)
      
    } catch (error) {
      console.error(`❌ ${account.role} test FAILED:`, error.message)
      allPassed = false
    }
  }
  
  console.log('\\n🏁 FINAL RESULT')
  console.log('==================')
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! System is ready for production.')
    console.log('\\n📋 Test Credentials:')
    console.log('┌─────────────────────────────────────────────────┐')
    console.log('│ Email                 │ Password    │ Role    │')
    console.log('├─────────────────────────────────────────────────┤')
    console.log('│ admin@kepanduan.com   │ admin123   │ ADMIN   │')
    console.log('│ masterguide@kepanduan.com │ masterguide123 │ MASTER_GUIDE │')
    console.log('│ adventurer@kepanduan.com │ adventurer123 │ ADVENTURER │')
    console.log('│ pathfinder@kepanduan.com │ pathfinder123 │ PATHFINDER │')
    console.log('└─────────────────────────────────────────────────┘')
  } else {
    console.log('❌ Some tests failed. Please check the issues above.')
  }
  
  return allPassed
}

finalTest()