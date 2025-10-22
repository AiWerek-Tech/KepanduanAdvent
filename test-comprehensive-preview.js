const axios = require('axios');

const BASE_URL = 'https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai';

const testAccounts = [
  { email: 'admin@kepanduan.com', password: 'admin123', role: 'ADMIN' },
  { email: 'masterguide@kepanduan.com', password: 'master123', role: 'MASTER_GUIDE' },
  { email: 'adventurer@kepanduan.com', password: 'adventurer123', role: 'ADVENTURER' },
  { email: 'pathfinder@kepanduan.com', password: 'pathfinder123', role: 'PATHFINDER' }
];

// Function to extract cookies from response
function extractCookies(response) {
  const setCookieHeader = response.headers['set-cookie'];
  if (!setCookieHeader) return '';
  
  const cookies = setCookieHeader.map(cookie => {
    return cookie.split(';')[0];
  }).join('; ');
  
  return cookies;
}

async function testComprehensivePreview() {
  console.log('🧪 Comprehensive Preview Application Test');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(60));
  
  let allTestsPassed = true;
  
  for (const account of testAccounts) {
    console.log(`\n🔐 Testing ${account.role} account...`);
    
    try {
      // Test login
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: account.email,
        password: account.password
      }, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      if (loginResponse.status === 200) {
        const cookies = extractCookies(loginResponse);
        
        if (cookies.includes('token=')) {
          console.log(`   ✅ ${account.role} Login successful (cookie received)`);
          
          // Test dashboard access
          const dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, {
            timeout: 10000,
            validateStatus: (status) => status < 500,
            headers: {
              'Cookie': cookies
            }
          });
          
          if (dashboardResponse.status === 200) {
            console.log(`   ✅ ${account.role} Dashboard accessible`);
          } else {
            console.log(`   ❌ ${account.role} Dashboard failed: ${dashboardResponse.status}`);
            allTestsPassed = false;
          }
          
          // Test user info API
          const userResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
            timeout: 10000,
            validateStatus: (status) => status < 500,
            headers: {
              'Cookie': cookies
            }
          });
          
          if (userResponse.status === 200 && userResponse.data.user) {
            console.log(`   ✅ ${account.role} User info accessible`);
          } else {
            console.log(`   ❌ ${account.role} User info failed: ${userResponse.status}`);
            allTestsPassed = false;
          }
          
          // Test logout
          const logoutResponse = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
            timeout: 10000,
            validateStatus: (status) => status < 500,
            headers: {
              'Cookie': cookies
            }
          });
          
          if (logoutResponse.status === 200) {
            console.log(`   ✅ ${account.role} Logout successful`);
          } else {
            console.log(`   ❌ ${account.role} Logout failed: ${logoutResponse.status}`);
            allTestsPassed = false;
          }
          
        } else {
          console.log(`   ❌ ${account.role} Login failed: No token cookie received`);
          allTestsPassed = false;
        }
        
      } else {
        console.log(`   ❌ ${account.role} Login failed: ${loginResponse.status}`);
        if (loginResponse.data) {
          console.log(`      Response: ${JSON.stringify(loginResponse.data)}`);
        }
        allTestsPassed = false;
      }
      
    } catch (error) {
      console.log(`   ❌ ${account.role} Test error: ${error.message}`);
      if (error.response) {
        console.log(`      Status: ${error.response.status}`);
        console.log(`      Data: ${JSON.stringify(error.response.data)}`);
      }
      allTestsPassed = false;
    }
  }
  
  // Test public pages
  console.log('\n📄 Testing Public Pages...');
  
  const publicPages = [
    { path: '/', name: 'Homepage' },
    { path: '/login', name: 'Login Page' },
    { path: '/register', name: 'Register Page' },
    { path: '/club', name: 'Club Page' },
    { path: '/seragam', name: 'Seragam Page' },
    { path: '/buku-panduan', name: 'Buku Panduan Page' },
    { path: '/kalender', name: 'Kalender Page' },
    { path: '/honors', name: 'Honors Page' },
    { path: '/materials', name: 'Materials Page' }
  ];
  
  for (const page of publicPages) {
    try {
      const response = await axios.get(`${BASE_URL}${page.path}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 200) {
        console.log(`   ✅ ${page.name} accessible`);
      } else {
        console.log(`   ❌ ${page.name} failed: ${response.status}`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${page.name} error: ${error.message}`);
      allTestsPassed = false;
    }
  }
  
  // Test API endpoints
  console.log('\n🔌 Testing API Endpoints...');
  
  const apiEndpoints = [
    { path: '/api/health', name: 'Health API' },
    { path: '/api/clubs', name: 'Clubs API' }
  ];
  
  for (const api of apiEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${api.path}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 200) {
        console.log(`   ✅ ${api.name} functional`);
      } else {
        console.log(`   ❌ ${api.name} failed: ${response.status}`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${api.name} error: ${error.message}`);
      allTestsPassed = false;
    }
  }
  
  // Final result
  console.log('\n' + '=' .repeat(60));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! Preview application is fully functional!');
    console.log('✅ URL: https://preview-chat-e1d91751-35fb-4b38-a717-f9e313cdabd3.space.z.ai');
    console.log('✅ Authentication: Working for all roles');
    console.log('✅ Dashboard: Accessible');
    console.log('✅ Public Pages: All accessible');
    console.log('✅ API Endpoints: Functional');
  } else {
    console.log('❌ Some tests failed. Please check the issues above.');
  }
  
  return allTestsPassed;
}

testComprehensivePreview();