// Test script to verify authentication and redirect flow
const testAuth = async () => {
  const baseUrl = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
  
  console.log('Testing authentication flow...');
  
  try {
    // Test 1: Check if login page loads
    console.log('\n1. Testing login page access...');
    const loginResponse = await fetch(`${baseUrl}/login`, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    console.log(`Login page status: ${loginResponse.status}`);
    
    // Test 2: Test login with valid credentials
    console.log('\n2. Testing login with valid credentials...');
    const loginData = {
      email: 'admin@kepanduan.com',
      password: 'admin123'
    };
    
    const loginPostResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      redirect: 'manual'
    });
    
    console.log(`Login API status: ${loginPostResponse.status}`);
    
    if (loginPostResponse.ok) {
      const loginResult = await loginPostResponse.json();
      console.log('Login successful:', loginResult.user?.email);
      
      // Extract cookies from response
      const cookies = loginPostResponse.headers.get('set-cookie');
      console.log('Cookies set:', cookies ? 'Yes' : 'No');
      
      // Test 3: Test dashboard access with cookies
      console.log('\n3. Testing dashboard access...');
      const dashboardResponse = await fetch(`${baseUrl}/dashboard`, {
        headers: {
          'Cookie': cookies || ''
        },
        redirect: 'manual'
      });
      
      console.log(`Dashboard access status: ${dashboardResponse.status}`);
      
      if (dashboardResponse.status === 200) {
        console.log('✅ Dashboard accessible - Authentication working!');
      } else if (dashboardResponse.status === 302 || dashboardResponse.status === 307) {
        const location = dashboardResponse.headers.get('location');
        console.log(`⚠️  Redirected to: ${location}`);
        if (location === '/login') {
          console.log('❌ Authentication failed - redirected to login');
        }
      } else {
        console.log(`❌ Unexpected status: ${dashboardResponse.status}`);
      }
      
      // Test 4: Test auth/me endpoint
      console.log('\n4. Testing /api/auth/me endpoint...');
      const authMeResponse = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          'Cookie': cookies || ''
        }
      });
      
      if (authMeResponse.ok) {
        const userData = await authMeResponse.json();
        console.log('✅ Auth/me working:', userData.user?.email);
      } else {
        console.log('❌ Auth/me failed:', authMeResponse.status);
      }
      
    } else {
      const errorData = await loginPostResponse.json();
      console.log('❌ Login failed:', errorData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

testAuth();