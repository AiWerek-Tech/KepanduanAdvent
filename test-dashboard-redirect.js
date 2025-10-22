// Test to understand the dashboard redirect
const testDashboard = async () => {
  const baseUrl = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
  
  console.log('Testing dashboard redirect...');
  
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
      
      // Now test dashboard with different methods
      console.log('\n1. Testing dashboard with GET (no redirect following)...');
      const dashboardResponse = await fetch(`${baseUrl}/dashboard`, {
        headers: {
          'Cookie': cookies || ''
        },
        redirect: 'manual'
      });
      
      console.log(`Status: ${dashboardResponse.status}`);
      console.log(`Headers:`, Object.fromEntries(dashboardResponse.headers.entries()));
      
      if (dashboardResponse.status >= 300 && dashboardResponse.status < 400) {
        const location = dashboardResponse.headers.get('location');
        console.log(`Redirect location: ${location}`);
        
        // Follow the redirect manually
        if (location) {
          console.log('\n2. Following redirect manually...');
          const redirectResponse = await fetch(`${baseUrl}${location}`, {
            headers: {
              'Cookie': cookies || ''
            },
            redirect: 'manual'
          });
          
          console.log(`Redirect status: ${redirectResponse.status}`);
          console.log(`Redirect headers:`, Object.fromEntries(redirectResponse.headers.entries()));
          
          if (redirectResponse.status >= 300 && redirectResponse.status < 400) {
            const newLocation = redirectResponse.headers.get('location');
            console.log(`Another redirect to: ${newLocation}`);
            if (newLocation === location) {
              console.log('🔄 REDIRECT LOOP DETECTED!');
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testDashboard();