const testBrowserSimulation = async () => {
  try {
    console.log('🌐 BROWSER SIMULATION TEST')
    console.log('=' .repeat(50))
    
    // Test 1: Admin login and access new-dashboard
    console.log('\n🔐 1. ADMIN LOGIN TEST')
    const adminLogin = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@kepanduan.com',
        password: 'password123'
      }),
    })
    
    if (adminLogin.ok) {
      const adminResult = await adminLogin.json()
      console.log(`✅ Admin login success: ${adminResult.user?.role}`)
      
      const adminCookie = adminLogin.headers.get('set-cookie')
      
      // Test accessing new-dashboard
      console.log('\n🏠 2. ADMIN ACCESS NEW-DASHBOARD')
      const dashboardResponse = await fetch('http://127.0.0.1:3000/new-dashboard', {
        headers: {
          'Cookie': adminCookie || ''
        }
      })
      
      if (dashboardResponse.ok) {
        console.log('✅ New-dashboard accessible (200 OK)')
        console.log('✅ No redirect loop detected')
      } else if (dashboardResponse.status === 307 || dashboardResponse.status === 302) {
        const location = dashboardResponse.headers.get('location')
        console.log(`❌ Unexpected redirect to: ${location}`)
      } else {
        console.log(`❌ Dashboard error: ${dashboardResponse.status}`)
      }
    } else {
      console.log('❌ Admin login failed')
    }
    
    // Test 2: Pathfinder login and access pathfinder
    console.log('\n🧭 3. PATHFINDER LOGIN TEST')
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
      const pathfinderResult = await pathfinderLogin.json()
      console.log(`✅ Pathfinder login success: ${pathfinderResult.user?.role}`)
      
      const pathfinderCookie = pathfinderLogin.headers.get('set-cookie')
      
      // Test accessing pathfinder dashboard
      console.log('\n🏠 4. PATHFINDER ACCESS DASHBOARD')
      const pathfinderResponse = await fetch('http://127.0.0.1:3000/pathfinder', {
        headers: {
          'Cookie': pathfinderCookie || ''
        }
      })
      
      if (pathfinderResponse.ok) {
        console.log('✅ Pathfinder dashboard accessible (200 OK)')
        console.log('✅ Hero Section should load properly')
      } else if (pathfinderResponse.status === 307 || pathfinderResponse.status === 302) {
        const location = pathfinderResponse.headers.get('location')
        console.log(`❌ Unexpected redirect to: ${location}`)
      } else {
        console.log(`❌ Pathfinder dashboard error: ${pathfinderResponse.status}`)
      }
      
      // Test pathfinder trying to access new-dashboard (should redirect)
      console.log('\n🚫 5. PATHFINDER ACCESS NEW-DASHBOARD (SHOULD REDIRECT)')
      const pathfinderToAdmin = await fetch('http://127.0.0.1:3000/new-dashboard', {
        headers: {
          'Cookie': pathfinderCookie || ''
        },
        redirect: 'manual'
      })
      
      if (pathfinderToAdmin.status === 307 || pathfinderToAdmin.status === 302) {
        const location = pathfinderToAdmin.headers.get('location')
        console.log(`✅ Correctly redirects to: ${location}`)
        if (location === '/pathfinder') {
          console.log('✅ Redirect destination correct!')
        } else {
          console.log('❌ Wrong redirect destination!')
        }
      } else {
        console.log(`❌ Should redirect but got: ${pathfinderToAdmin.status}`)
      }
    } else {
      console.log('❌ Pathfinder login failed')
    }
    
    // Test 3: Check login page loads
    console.log('\n🔑 6. LOGIN PAGE ACCESS')
    const loginPage = await fetch('http://127.0.0.1:3000/login')
    if (loginPage.ok) {
      console.log('✅ Login page accessible')
    } else {
      console.log('❌ Login page error')
    }
    
    console.log('\n🎯 7. AUTHENTICATION ENDPOINTS')
    
    // Test auth/me without token
    const authMeNoToken = await fetch('http://127.0.0.1:3000/api/auth/me')
    if (authMeNoToken.status === 401) {
      console.log('✅ Auth/me correctly rejects unauthenticated requests')
    } else {
      console.log('❌ Auth/me should reject unauthenticated requests')
    }
    
    // Test auth/me with valid token
    const authMeWithToken = await fetch('http://127.0.0.1:3000/api/auth/me', {
      headers: {
        'Cookie': adminLogin.headers.get('set-cookie') || ''
      }
    })
    if (authMeWithToken.ok) {
      const authData = await authMeWithToken.json()
      console.log(`✅ Auth/me works for authenticated user: ${authData.user?.role}`)
    } else {
      console.log('❌ Auth/me failed for authenticated user')
    }
    
    console.log('\n🎉 BROWSER SIMULATION COMPLETED!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testBrowserSimulation()