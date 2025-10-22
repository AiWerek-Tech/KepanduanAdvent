const http = require('http');

async function checkErrorIndicators() {
  console.log('🔍 Checking for error indicators in page content...\n');

  const url = 'http://localhost:3000';
  
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === 200) {
      // Look for specific error patterns
      const errorPatterns = [
        '404',
        'Not Found',
        'error',
        'Error',
        'ERROR',
        'Failed to load resource',
        'Cannot read property',
        'TypeError',
        'ReferenceError'
      ];
      
      console.log('📄 Page content analysis:');
      console.log(`   Content length: ${response.data.length} characters`);
      console.log(`   Contains <html>: ${response.data.includes('<html')}`);
      console.log(`   Contains </html>: ${response.data.includes('</html>')}`);
      console.log(`   Contains <head>: ${response.data.includes('<head')}`);
      console.log(`   Contains <body>: ${response.data.includes('<body')}`);
      
      console.log('\n🔍 Error pattern detection:');
      errorPatterns.forEach(pattern => {
        const count = (response.data.match(new RegExp(pattern, 'gi')) || []).length;
        if (count > 0) {
          console.log(`   ⚠️  "${pattern}" found ${count} time(s)`);
          
          // Show context around the error
          const index = response.data.toLowerCase().indexOf(pattern.toLowerCase());
          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(response.data.length, index + pattern.length + 50);
            const context = response.data.substring(start, end);
            console.log(`   Context: ...${context}...`);
          }
        }
      });
      
      // Check for missing resources
      console.log('\n📦 Resource checking:');
      const cssMatches = response.data.match(/href="([^"]+\.css)"/g) || [];
      const jsMatches = response.data.match(/src="([^"]+\.js)"/g) || [];
      
      console.log(`   CSS files found: ${cssMatches.length}`);
      cssMatches.forEach(match => console.log(`     ${match}`));
      
      console.log(`   JS files found: ${jsMatches.length}`);
      jsMatches.forEach(match => console.log(`     ${match}`));
      
      // Check for manifest.json
      const hasManifest = response.data.includes('manifest.json');
      console.log(`   Has manifest: ${hasManifest}`);
      
      // Check for icons
      const iconMatches = response.data.match(/href="([^"]*icon[^"]*)"/g) || [];
      console.log(`   Icon references: ${iconMatches.length}`);
      iconMatches.forEach(match => console.log(`     ${match}`));
      
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
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

checkErrorIndicators().catch(console.error);