// Test authentication flow with all accounts
const testAllAccounts = async () => {
  const accounts = [
    { email: 'admin@kepanduan.com', password: 'admin123', role: 'ADMIN' },
    { email: 'masterguide@kepanduan.com', password: 'masterguide123', role: 'MASTER_GUIDE' },
    { email: 'adventurer@kepanduan.com', password: 'adventurer123', role: 'ADVENTURER' },
    { email: 'pathfinder@kepanduan.com', password: 'pathfinder123', role: 'PATHFINDER' }
  ]

  for (const account of accounts) {
    console.log(`\\n🔐 Testing ${account.role} account: ${account.email}`)
    
    try {
      // Test 1: Login
      console.log('1. Testing login...')
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
      console.log('✅ Login successful:', loginData.user.email, 'Role:', loginData.user.role)
      
      // Extract token from cookies
      const setCookieHeader = loginResponse.headers.get('set-cookie')
      const tokenMatch = setCookieHeader?.match(/token=([^;]+)/)
      const token = tokenMatch ? tokenMatch[1] : null
      
      if (!token) {
        throw new Error('No token found in cookies')
      }
      
      // Test 2: Auth me
      console.log('2. Testing /api/auth/me...')
      const meResponse = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Cookie': `token=${token}` }
      })
      
      if (!meResponse.ok) {
        throw new Error(`Auth me failed: ${meResponse.status}`)
      }
      
      const meData = await meResponse.json()
      console.log('✅ Auth me successful:', meData.user.email, 'Role:', meData.user.role)
      
      // Test 3: Dashboard access (simulate)
      console.log('3. Testing dashboard access...')
      const dashboardResponse = await fetch('http://localhost:3000/api/auth/me', {
        headers: { 'Cookie': `token=${token}` }
      })
      
      if (dashboardResponse.ok) {
        console.log('✅ Dashboard access would be successful')
      } else {
        console.log('❌ Dashboard access would fail')
      }
      
      // Test 4: Logout
      console.log('4. Testing logout...')
      const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { 'Cookie': `token=${token}` }
      })
      
      if (!logoutResponse.ok) {
        throw new Error(`Logout failed: ${logoutResponse.status}`)
      }
      
      console.log('✅ Logout successful')
      console.log(`🎉 ${account.role} account test passed!`)
      
    } catch (error) {
      console.error(`❌ ${account.role} account test failed:`, error.message)
    }
  }
  
  console.log('\\n🏁 All account tests completed!')
}

testAllAccounts()