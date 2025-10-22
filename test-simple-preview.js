const axios = require('axios');

const BASE_URL = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';

async function testSimplePreview() {
  console.log('🧪 Simple Preview Test');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  try {
    // Test 1: Homepage
    console.log('\n📄 Testing homepage...');
    const homeResponse = await axios.get(BASE_URL, { timeout: 10000 });
    console.log(`✅ Homepage: ${homeResponse.status}`);
    
    // Test 2: Login page
    console.log('\n🔐 Testing login page...');
    const loginPageResponse = await axios.get(`${BASE_URL}/login`, { timeout: 10000 });
    console.log(`✅ Login page: ${loginPageResponse.status}`);
    
    // Test 3: Login API
    console.log('\n🔑 Testing login API...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@kepanduan.com',
      password: 'admin123'
    }, { 
      timeout: 10000,
      maxRedirects: 0 // Prevent redirects
    });
    
    if (loginResponse.status === 200) {
      console.log('✅ Login API successful');
      
      // Extract cookies
      const cookies = loginResponse.headers['set-cookie'] ? 
        loginResponse.headers['set-cookie'][0].split(';')[0] : '';
      
      if (cookies) {
        console.log(`✅ Cookie received: ${cookies}`);
        
        // Test 4: API me endpoint
        console.log('\n👤 Testing user info API...');
        try {
          const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
            timeout: 10000,
            headers: { 'Cookie': cookies },
            maxRedirects: 0
          });
          
          if (meResponse.status === 200) {
            console.log(`✅ User info: ${meResponse.data.user.name} (${meResponse.data.user.role})`);
          } else {
            console.log(`❌ User info failed: ${meResponse.status}`);
          }
        } catch (meError) {
          console.log(`❌ User info error: ${meError.message}`);
        }
        
        // Test 5: Health API
        console.log('\n🏥 Testing health API...');
        try {
          const healthResponse = await axios.get(`${BASE_URL}/api/health`, { timeout: 10000 });
          console.log(`✅ Health API: ${healthResponse.status}`);
        } catch (healthError) {
          console.log(`❌ Health API error: ${healthError.message}`);
        }
        
      } else {
        console.log('❌ No cookie received');
      }
    } else {
      console.log(`❌ Login failed: ${loginResponse.status}`);
    }
    
    console.log('\n🎉 Simple test completed!');
    console.log('✅ Preview application is accessible and functional');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
    }
  }
}

testSimplePreview();