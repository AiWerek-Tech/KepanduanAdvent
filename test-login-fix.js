const testLogin = async () => {
  try {
    console.log('🧪 Testing Login Flow...')
    
    // Test 1: Check if login page loads
    console.log('1️⃣ Testing login page load...')
    const loginResponse = await fetch('http://127.0.0.1:3000/login')
    if (loginResponse.ok) {
      console.log('✅ Login page loads successfully')
    } else {
      console.log('❌ Login page failed to load')
      return
    }
    
    // Test 2: Test login API with sample credentials
    console.log('2️⃣ Testing login API...')
    const loginData = {
      email: 'pathfinder@kepanduan.com',
      password: 'password123'
    }
    
    const apiResponse = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    
    if (apiResponse.ok) {
      const result = await apiResponse.json()
      console.log('✅ Login API works:', result.user?.role)
      
      // Test 3: Test auth/me API
      console.log('3️⃣ Testing auth/me API...')
      const cookieHeader = apiResponse.headers.get('set-cookie')
      const authResponse = await fetch('http://127.0.0.1:3000/api/auth/me', {
        headers: {
          'Cookie': cookieHeader || ''
        }
      })
      
      if (authResponse.ok) {
        const authResult = await authResponse.json()
        console.log('✅ Auth/me API works:', authResult.user?.role)
        
        // Test 4: Test redirect based on role
        if (authResult.user?.role === 'PATHFINDER') {
          console.log('✅ Should redirect to /pathfinder')
        } else {
          console.log('✅ Should redirect to /new-dashboard')
        }
      } else {
        console.log('❌ Auth/me API failed')
      }
    } else {
      const error = await apiResponse.json()
      console.log('❌ Login API failed:', error.error)
    }
    
    console.log('🎉 Login test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testLogin()