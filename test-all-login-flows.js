const testAllLoginFlows = async () => {
  try {
    console.log('🧪 TESTING ALL LOGIN FLOWS')
    console.log('=' .repeat(50))
    
    const users = [
      { email: 'pathfinder@kepanduan.com', role: 'PATHFINDER', expected: '/pathfinder' },
      { email: 'admin@kepanduan.com', role: 'ADMIN', expected: '/new-dashboard' },
      { email: 'masterguide@kepanduan.com', role: 'MASTER_GUIDE', expected: '/new-dashboard' },
      { email: 'adventurer@kepanduan.com', role: 'ADVENTURER', expected: '/new-dashboard' }
    ]
    
    for (const user of users) {
      console.log(`\n🔐 Testing ${user.email} (${user.role})`)
      
      // Test login API
      const loginResponse = await fetch('http://127.0.0.1:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: 'password123'
        }),
      })
      
      if (loginResponse.ok) {
        const result = await loginResponse.json()
        console.log(`  ✅ Login API Success: ${result.user?.role}`)
        
        // Test auth/me API
        const cookieHeader = loginResponse.headers.get('set-cookie')
        const authResponse = await fetch('http://127.0.0.1:3000/api/auth/me', {
          headers: {
            'Cookie': cookieHeader || ''
          }
        })
        
        if (authResponse.ok) {
          const authResult = await authResponse.json()
          console.log(`  ✅ Auth/me Success: ${authResult.user?.role}`)
          
          // Check role consistency
          if (authResult.user?.role === user.role) {
            console.log(`  ✅ Role Consistent: ${user.role}`)
            console.log(`  🎯 Should redirect to: ${user.expected}`)
          } else {
            console.log(`  ❌ Role Mismatch: Expected ${user.role}, got ${authResult.user?.role}`)
          }
        } else {
          console.log(`  ❌ Auth/me Failed: ${authResponse.status}`)
        }
      } else {
        const error = await loginResponse.json()
        console.log(`  ❌ Login Failed: ${error.error}`)
      }
    }
    
    console.log('\n🎯 MIDDLEWARE ROUTING TEST')
    console.log('=' .repeat(50))
    
    // Test middleware routing with a valid token
    const pathfinderLogin = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'pathfinder@kepanduan.com',
        password: 'password123'
      }),
    })
    
    if (pathfinderLogin.ok) {
      const cookieHeader = pathfinderLogin.headers.get('set-cookie')
      
      // Test pathfinder accessing /new-dashboard (should redirect)
      console.log('\n🧭 Testing PATHFINDER access to /new-dashboard:')
      const redirectTest = await fetch('http://127.0.0.1:3000/new-dashboard', {
        headers: {
          'Cookie': cookieHeader || ''
        },
        redirect: 'manual' // Don't follow redirects automatically
      })
      
      if (redirectTest.status === 307 || redirectTest.status === 302) {
        const location = redirectTest.headers.get('location')
        console.log(`  ✅ Redirects to: ${location}`)
        if (location === '/pathfinder') {
          console.log(`  ✅ Correct redirect!`)
        } else {
          console.log(`  ❌ Wrong redirect! Expected /pathfinder`)
        }
      } else {
        console.log(`  ❌ No redirect! Status: ${redirectTest.status}`)
      }
    }
    
    console.log('\n🎉 ALL TESTS COMPLETED!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAllLoginFlows()