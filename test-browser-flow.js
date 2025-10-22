// Test browser-like behavior to catch redirect loops
const testBrowserFlow = async () => {
  console.log('🌐 Testing browser-like flow...')
  
  try {
    // Simulate browser accessing login page
    console.log('1. Accessing login page...')
    const loginPageResponse = await fetch('http://localhost:3000/login', {
      redirect: 'manual' // Don't follow redirects automatically
    })
    
    console.log('Login page status:', loginPageResponse.status)
    if (loginPageResponse.status === 200) {
      console.log('✅ Login page accessible')
    } else if (loginPageResponse.status >= 300 && loginPageResponse.status < 400) {
      console.log('📍 Login page redirects to:', loginPageResponse.headers.get('location'))
    }
    
    // Simulate login
    console.log('2. Submitting login form...')
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
    console.log('✅ Login API successful')
    
    // Extract token
    const setCookieHeader = loginResponse.headers.get('set-cookie')
    const tokenMatch = setCookieHeader?.match(/token=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : null
    
    if (!token) {
      throw new Error('No token found')
    }
    
    // Simulate accessing dashboard with token
    console.log('3. Accessing dashboard with token...')
    const dashboardResponse = await fetch('http://localhost:3000/dashboard', {
      headers: { 'Cookie': `token=${token}` },
      redirect: 'manual'
    })
    
    console.log('Dashboard response status:', dashboardResponse.status)
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard accessible - no redirect loop!')
    } else if (dashboardResponse.status >= 300 && dashboardResponse.status < 400) {
      const location = dashboardResponse.headers.get('location')
      console.log('📍 Dashboard redirects to:', location)
      
      if (location === '/login') {
        console.log('⚠️  Dashboard redirects to login - possible authentication issue')
      } else if (location === '/dashboard') {
        console.log('🔄 DASHBOARD REDIRECT LOOP DETECTED!')
        return false
      }
    }
    
    // Test accessing login page with valid token
    console.log('4. Accessing login page with valid token...')
    const loginWithTokenResponse = await fetch('http://localhost:3000/login', {
      headers: { 'Cookie': `token=${token}` },
      redirect: 'manual'
    })
    
    console.log('Login with token status:', loginWithTokenResponse.status)
    
    if (loginWithTokenResponse.status >= 300 && loginWithTokenResponse.status < 400) {
      const location = loginWithTokenResponse.headers.get('location')
      console.log('✅ Login page redirects to:', location, '- correct behavior')
    }
    
    console.log('🎉 Browser flow test completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Browser flow test failed:', error.message)
    return false
  }
}

testBrowserFlow()