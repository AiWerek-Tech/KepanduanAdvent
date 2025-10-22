const http = require('http');

async function testPages() {
  console.log('🧪 Testing all pages after fixing loading issues...\n');

  const testUrls = [
    { name: 'Landing Page', url: 'http://localhost:3000' },
    { name: 'Login Page', url: 'http://localhost:3000/login' },
    { name: 'Admin Dashboard', url: 'http://localhost:3000/new-dashboard' },
    { name: 'Pathfinder Dashboard', url: 'http://localhost:3000/pathfinder' },
    { name: 'Register Page', url: 'http://localhost:3000/register' }
  ];

  for (const test of testUrls) {
    console.log(`📍 Testing ${test.name}...`);
    
    try {
      const response = await makeRequest(test.url);
      
      if (response.statusCode === 200) {
        console.log(`   ✅ Status: ${response.statusCode}`);
        
        // Check for HTML content
        if (response.data.includes('<html') && response.data.includes('</html>')) {
          console.log(`   ✅ Valid HTML structure`);
        } else {
          console.log(`   ❌ Invalid HTML structure`);
        }
        
        // Check for common elements
        const hasBody = response.data.includes('<body');
        const hasTitle = response.data.includes('<title>');
        const hasContent = response.data.length > 1000;
        
        console.log(`   ✅ Has body tag: ${hasBody}`);
        console.log(`   ✅ Has title tag: ${hasTitle}`);
        console.log(`   ✅ Has sufficient content: ${hasContent}`);
        
        // Check for CSS links
        const hasCSS = response.data.includes('css') || response.data.includes('stylesheet');
        console.log(`   ✅ Has CSS: ${hasCSS}`);
        
        // Check for JavaScript
        const hasJS = response.data.includes('script') || response.data.includes('javascript');
        console.log(`   ✅ Has JavaScript: ${hasJS}`);
        
        // Check for error indicators
        const hasError = response.data.includes('error') || response.data.includes('Error') || response.data.includes('ERROR');
        if (hasError) {
          console.log(`   ⚠️  Contains error indicators`);
        }
        
      } else if (response.statusCode >= 300 && response.statusCode < 400) {
        console.log(`   ✅ Redirect: ${response.statusCode}`);
        if (response.headers.location) {
          console.log(`   ✅ Redirects to: ${response.headers.location}`);
        }
      } else {
        console.log(`   ❌ Status: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('🎉 Page testing completed!');
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TestBot/1.0)'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

testPages().catch(console.error);