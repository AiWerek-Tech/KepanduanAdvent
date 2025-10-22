// Test the new /home route
const testHomeRoute = async () => {
  const baseUrl = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
  
  console.log('Testing /home route...');
  
  try {
    // First login to get cookies
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@kepanduan.com',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('Got cookies from login');
      
      // Test /home route
      console.log('\n1. Testing /home route with cookies...');
      const homeResponse = await fetch(`${baseUrl}/home`, {
        headers: {
          'Cookie': cookies || ''
        },
        redirect: 'manual'
      });
      
      console.log(`Home status: ${homeResponse.status}`);
      console.log(`Home headers:`, Object.fromEntries(homeResponse.headers.entries()));
      
      if (homeResponse.status === 200) {
        console.log('✅ /home route works correctly!');
      } else if (homeResponse.status >= 300 && homeResponse.status < 400) {
        const location = homeResponse.headers.get('location');
        console.log(`⚠️  /home redirected to: ${location}`);
      } else {
        console.log(`❌ /home returned status: ${homeResponse.status}`);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testHomeRoute();