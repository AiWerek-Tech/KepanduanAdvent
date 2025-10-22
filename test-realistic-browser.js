// Test with more realistic browser simulation
const testRealisticBrowser = async () => {
  console.log('🌐 Testing realistic browser behavior...')
  
  // Create a cookie jar to simulate browser
  const cookies = new Map()
  
  try {
    // Step 1: Visit login page (like typing URL in browser)
    console.log('1. Visiting login page...')
    const loginPageResponse = await fetch('http://localhost:3000/login', {
      redirect: 'manual'
    })
    
    console.log('Login page status:', loginPageResponse.status)
    
    // Step 2: Submit login form
    console.log('2. Submitting login form...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@kepanduan.com',
        password: 'admin123'
      }),
      redirect: 'manual'
    })
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`)
    }
    
    // Extract and store cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie')
    console.log('Set-Cookie header:', setCookieHeader)
    
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/)
      if (tokenMatch) {
        cookies.set('token', tokenMatch[1])
        console.log('✅ Token extracted and stored')
      }
    }
    
    // Step 3: Access dashboard with cookie (like browser redirect after login)
    console.log('3. Accessing dashboard with stored cookie...')
    const cookieString = `token=${cookies.get('token')}`
    console.log('Cookie string:', cookieString)
    
    const dashboardResponse = await fetch('http://localhost:3000/dashboard', {
      headers: { 'Cookie': cookieString },
      redirect: 'manual' // Don't follow redirects automatically
    })
    
    console.log('Dashboard response status:', dashboardResponse.status)
    console.log('Dashboard location:', dashboardResponse.headers.get('location'))
    
    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard accessible - SUCCESS!')
    } else if (dashboardResponse.status >= 300 && dashboardResponse.status < 400) {
      const location = dashboardResponse.headers.get('location')
      console.log('📍 Dashboard redirects to:', location)
      
      if (location === '/login') {
        console.log('⚠️  Dashboard redirects to login - authentication issue')
      } else if (location === '/dashboard') {
        console.log('🔄 REDIRECT LOOP DETECTED!')
        return false
      } else {
        console.log('📍 Unexpected redirect:', location)
      }
    }
    
    // Step 4: Try accessing login page again with valid cookie
    console.log('4. Accessing login page with valid cookie...')
    const loginAgainResponse = await fetch('http://localhost:3000/login', {
      headers: { 'Cookie': cookieString },
      redirect: 'manual'
    })
    
    console.log('Login again status:', loginAgainResponse.status)
    console.log('Login again location:', loginAgainResponse.headers.get('location'))
    
    if (loginAgainResponse.status >= 300 && loginAgainResponse.status < 400) {
      const location = loginAgainResponse.headers.get('location')
      if (location === '/dashboard') {
        console.log('✅ Login page correctly redirects to dashboard with valid token')
      } else {
        console.log('⚠️  Unexpected redirect from login:', location)
      }
    } else {
      console.log('⚠️  Login page should redirect with valid token, but got:', loginAgainResponse.status)
    }
    
    console.log('🎉 Realistic browser test completed!')
    return true
    
  } catch (error) {
    console.error('❌ Realistic browser test failed:', error.message)
    return false
  }
}

testRealisticBrowser()