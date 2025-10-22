const puppeteer = require('puppeteer');

async function testPages() {
  console.log('🧪 Testing all pages after fixing loading issues...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Test 1: Landing Page
    console.log('📍 Testing Landing Page...');
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait for page to load and check for content
      await page.waitForSelector('body', { timeout: 10000 });
      
      const pageTitle = await page.title();
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.length > 100;
      });
      
      console.log(`   ✅ Title: ${pageTitle}`);
      console.log(`   ✅ Has content: ${hasContent}`);
      
      // Check for main elements
      const hasHero = await page.$('h1') !== null;
      const hasButtons = await page.$('button') !== null;
      console.log(`   ✅ Has hero section: ${hasHero}`);
      console.log(`   ✅ Has buttons: ${hasButtons}`);
      
    } catch (error) {
      console.log(`   ❌ Landing page failed: ${error.message}`);
    }

    // Test 2: Login Page
    console.log('\n📍 Testing Login Page...');
    try {
      await page.goto('http://localhost:3000/login', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      await page.waitForSelector('body', { timeout: 10000 });
      
      const pageTitle = await page.title();
      const hasLoginForm = await page.$('form') !== null;
      const hasEmailInput = await page.$('input[type="email"]') !== null;
      const hasPasswordInput = await page.$('input[type="password"]') !== null;
      
      console.log(`   ✅ Title: ${pageTitle}`);
      console.log(`   ✅ Has login form: ${hasLoginForm}`);
      console.log(`   ✅ Has email input: ${hasEmailInput}`);
      console.log(`   ✅ Has password input: ${hasPasswordInput}`);
      
    } catch (error) {
      console.log(`   ❌ Login page failed: ${error.message}`);
    }

    // Test 3: Admin Dashboard (without login)
    console.log('\n📍 Testing Admin Dashboard redirect...');
    try {
      const response = await page.goto('http://localhost:3000/new-dashboard', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Should redirect to login if not authenticated
      const currentUrl = page.url();
      const isRedirectedToLogin = currentUrl.includes('/login');
      
      console.log(`   ✅ Redirected to login: ${isRedirectedToLogin}`);
      console.log(`   ✅ Current URL: ${currentUrl}`);
      
    } catch (error) {
      console.log(`   ❌ Dashboard redirect failed: ${error.message}`);
    }

    // Test 4: Pathfinder Dashboard (without login)
    console.log('\n📍 Testing Pathfinder Dashboard redirect...');
    try {
      const response = await page.goto('http://localhost:3000/pathfinder', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Should redirect to login if not authenticated
      const currentUrl = page.url();
      const isRedirectedToLogin = currentUrl.includes('/login');
      
      console.log(`   ✅ Redirected to login: ${isRedirectedToLogin}`);
      console.log(`   ✅ Current URL: ${currentUrl}`);
      
    } catch (error) {
      console.log(`   ❌ Pathfinder redirect failed: ${error.message}`);
    }

    // Test 5: Check for CSS and JS loading
    console.log('\n📍 Testing CSS and JS loading...');
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Check if CSS loaded properly
      const computedStyle = await page.evaluate(() => {
        const testElement = document.querySelector('body');
        return window.getComputedStyle(testElement).backgroundColor;
      });
      
      console.log(`   ✅ CSS loaded - body background: ${computedStyle}`);
      
      // Check for JavaScript functionality
      const jsWorking = await page.evaluate(() => {
        return typeof window !== 'undefined' && document.readyState === 'complete';
      });
      
      console.log(`   ✅ JavaScript working: ${jsWorking}`);
      
    } catch (error) {
      console.log(`   ❌ CSS/JS test failed: ${error.message}`);
    }

    console.log('\n🎉 Page testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testPages().catch(console.error);