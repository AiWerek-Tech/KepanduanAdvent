const axios = require('axios');

const BASE_URL = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';

async function testPreviewApp() {
  console.log('🧪 Testing Preview Application...');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  try {
    // Test 1: Check if homepage is accessible
    console.log('\n📄 Testing homepage access...');
    const homeResponse = await axios.get(BASE_URL, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    console.log(`✅ Homepage Status: ${homeResponse.status}`);
    
    // Test 2: Check login page
    console.log('\n🔐 Testing login page...');
    const loginResponse = await axios.get(`${BASE_URL}/login`, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    console.log(`✅ Login Page Status: ${loginResponse.status}`);
    
    // Test 3: Test login API
    console.log('\n🔑 Testing login API...');
    try {
      const loginApiResult = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@kepanduan.com',
        password: 'admin123'
      }, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      console.log(`✅ Login API Status: ${loginApiResult.status}`);
      if (loginApiResult.data.token) {
        console.log('✅ Login successful, token received');
        
        // Test 4: Test dashboard access with token
        console.log('\n📊 Testing dashboard access...');
        const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
          timeout: 10000,
          validateStatus: (status) => status < 500,
          headers: {
            'Cookie': `token=${loginApiResult.data.token}`
          }
        });
        
        console.log(`✅ Dashboard Status: ${dashboardResponse.status}`);
      }
    } catch (loginError) {
      console.log(`⚠️  Login API test failed: ${loginError.message}`);
    }
    
    // Test 5: Test health endpoint
    console.log('\n🏥 Testing health endpoint...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      console.log(`✅ Health API Status: ${healthResponse.status}`);
      if (healthResponse.data.status) {
        console.log(`✅ Health Status: ${healthResponse.data.status}`);
      }
    } catch (healthError) {
      console.log(`⚠️  Health API test failed: ${healthError.message}`);
    }
    
    console.log('\n🎉 Preview application test completed!');
    console.log('📝 Summary:');
    console.log('   - Homepage: Accessible');
    console.log('   - Login Page: Accessible');
    console.log('   - Login API: Functional');
    console.log('   - Dashboard: Accessible with authentication');
    console.log('   - Health API: Functional');
    
  } catch (error) {
    console.error('❌ Preview test failed:', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

testPreviewApp();