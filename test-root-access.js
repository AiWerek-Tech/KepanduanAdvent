// Test if root path works with authentication
const testRoot = async () => {
  const baseUrl = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
  
  console.log('Testing root path access...');
  
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
      
      // Test root path
      console.log('\n1. Testing root path with cookies...');
      const rootResponse = await fetch(`${baseUrl}/`, {
        headers: {
          'Cookie': cookies || ''
        },
        redirect: 'manual'
      });
      
      console.log(`Root status: ${rootResponse.status}`);
      console.log(`Root headers:`, Object.fromEntries(rootResponse.headers.entries()));
      
      // Test a simple path like /profile
      console.log('\n2. Testing /profile path...');
      const profileResponse = await fetch(`${baseUrl}/profile`, {
        headers: {
          'Cookie': cookies || ''
        },
        redirect: 'manual'
      });
      
      console.log(`Profile status: ${profileResponse.status}`);
      console.log(`Profile headers:`, Object.fromEntries(profileResponse.headers.entries()));
      
      if (profileResponse.status >= 300 && profileResponse.status < 400) {
        const location = profileResponse.headers.get('location');
        console.log(`Profile redirect location: ${location}`);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testRoot();