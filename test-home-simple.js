// Test the /home route without authentication
const testHomeSimple = async () => {
  const baseUrl = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';
  
  console.log('Testing /home route without authentication...');
  
  try {
    const homeResponse = await fetch(`${baseUrl}/home`, {
      redirect: 'manual'
    });
    
    console.log(`Home status: ${homeResponse.status}`);
    
    if (homeResponse.status === 200) {
      console.log('✅ /home route is accessible!');
    } else if (homeResponse.status === 302 || homeResponse.status === 307) {
      const location = homeResponse.headers.get('location');
      console.log(`⚠️  /home redirected to: ${location}`);
    } else if (homeResponse.status === 404) {
      console.log('❌ /home route not found (404)');
    } else {
      console.log(`❌ /home returned status: ${homeResponse.status}`);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testHomeSimple();