// Test complete flow with new middleware
const testCompleteFlow = async () => {
  console.log('🔄 Testing complete authentication flow...')
  
  try {
    // Step 1: Access login page (should be accessible)
    console.log('1. Testing login page access...')
    const loginPageResponse = await fetch('http://localhost:3000/login', {
      redirect: 'manual'
    })
    
    console.log('Login page status:', loginPageResponse.status)
    if (loginPageResponse.status === 200) {
      console.log('✅ Login page accessible')
    } else {
      console.log('❌ Login page not accessible')
      return
    }
    
    // Step 2: Login
    console.log('2. Testing login...')
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
    console.log('✅ Login successful')
    
    // Extract token
    const setCookieHeader = loginResponse.headers.get('set-cookie')
    const tokenMatch = setCookieHeader?.match(/token=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : null
    
    if (!token) {
      throw new Error('No token found')
    }
    
    // Step 3: Access dashboard with token
    console.log('3. Testing dashboard access...')
    const dashboardResponse = await fetch('http://localhost:3000/dashboard', {
      headers: { 'Cookie': `token=${token}` },
      redirect: 'manual'
    })
    
    console.log('Dashboard response status:', dashboardResponse.status)
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard accessible - SUCCESS!')
    } else if (dashboardResponse.status >= 300 && dashboardResponse.status < 400) {
      const location = dashboardResponse.headers.get('location')
      console.log('📍 Dashboard redirects to:', location)
      
      if (location === '/login') {
        console.log('⚠️  Dashboard redirects to login')
      } else if (location && location.includes('/dashboard')) {
        console.log('🔄 REDIRECT LOOP DETECTED!')
        return false
      }
    }
    
    // Step 4: Access login page with token (should redirect to dashboard)
    console.log('4. Testing login page with token...')
    const loginWithTokenResponse = await fetch('http://localhost:3000/login', {
      headers: { 'Cookie': `token=${token}` },
      redirect: 'manual'
    })
    
    console.log('Login with token status:', loginWithTokenResponse.status)
    
    if (loginWithTokenResponse.status >= 300 && loginWithTokenResponse.status < 400) {
      const location = loginWithTokenResponse.headers.get('location')
      if (location === '/dashboard') {
        console.log('✅ Login page correctly redirects to dashboard')
      } else {
        console.log('⚠️  Login page redirects to:', location)
      }
    }
    
    console.log('🎉 Complete flow test PASSED!')
    return true
    
  } catch (error) {
    console.error('❌ Complete flow test failed:', error.message)
    return false
  }
}

testCompleteFlow()