// Test authentication flow
const testAuth = async () => {
  try {
    console.log('🔐 Testing Authentication Flow...')
    
    // Test 1: Login
    console.log('1. Testing login...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kepanduan.com',
        password: 'admin123'
      })
    })
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`)
    }
    
    const loginData = await loginResponse.json()
    console.log('✅ Login successful:', loginData.user.email)
    
    // Extract token from cookies
    const setCookieHeader = loginResponse.headers.get('set-cookie')
    const tokenMatch = setCookieHeader?.match(/token=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : null
    
    if (!token) {
      throw new Error('No token found in cookies')
    }
    
    console.log('✅ Token extracted')
    
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
    
    // Test 3: Access clubs
    console.log('3. Testing clubs API...')
    const clubsResponse = await fetch('http://localhost:3000/api/clubs', {
      headers: { 'Cookie': `token=${token}` }
    })
    
    if (!clubsResponse.ok) {
      throw new Error(`Clubs API failed: ${clubsResponse.status}`)
    }
    
    const clubsData = await clubsResponse.json()
    console.log('✅ Clubs API successful:', clubsData.clubs?.length || 0, 'clubs found')
    
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
    
    console.log('🎉 All authentication tests passed!')
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message)
  }
}

testAuth()