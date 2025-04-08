/**
 * Script to test browser-like login with cookie handling
 */
const fetch = require('node-fetch');
const { CookieJar } = require('tough-cookie');
const fetchCookieCreator = require('fetch-cookie');
const fetchWithCookies = fetchCookieCreator(fetch);

async function testBrowserLogin() {
  // Create a cookie jar to store cookies
  const jar = new CookieJar();
  
  try {
    console.log('Testing login for user: admin@example.com');
    
    // Login step
    const loginResponse = await fetchWithCookies('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    });
    
    const loginData = await loginResponse.json();
    
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (loginResponse.status === 200 && loginData.success) {
      console.log('Login successful!');
      
      // Now try to access a protected route
      console.log('\nTrying to access a protected route with the auth cookie...');
      const dashboardResponse = await fetchWithCookies('http://localhost:3002/api/dashboard', {
        method: 'GET',
      });
      
      try {
        const dashboardData = await dashboardResponse.json();
        console.log('Dashboard Status:', dashboardResponse.status);
        console.log('Dashboard Response:', JSON.stringify(dashboardData, null, 2));
      } catch (e) {
        console.log('Dashboard Status:', dashboardResponse.status);
        console.log('Dashboard Response is not JSON');
      }
    } else {
      console.log('Login failed.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Check if we have the required modules
try {
  if (!require('node-fetch') || !require('tough-cookie') || !require('fetch-cookie')) {
    console.log('Required modules not found. Installing...');
    console.log('Run: npm install node-fetch@2 tough-cookie fetch-cookie');
    process.exit(1);
  }
  
  testBrowserLogin();
} catch (e) {
  console.log('Required modules not found. Installing...');
  console.log('Run: npm install node-fetch@2 tough-cookie fetch-cookie');
} 