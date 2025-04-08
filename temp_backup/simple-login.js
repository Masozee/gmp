/**
 * Simple login test using axios
 */
const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

// Enable cookie support for axios
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

async function testLogin() {
  try {
    console.log('Testing login for user: admin@example.com');
    
    // Create axios instance with cookie jar
    const api = axios.create({
      baseURL: 'http://localhost:3002',
      jar: cookieJar,
      withCredentials: true
    });
    
    // Login
    const loginResponse = await api.post('/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('Login successful!');
      
      // Get all cookies
      const cookies = cookieJar.getCookiesSync('http://localhost:3002');
      console.log('Cookies:', cookies.map(c => c.toString()));
      
      // Try to access dashboard
      console.log('\nTrying to access dashboard...');
      try {
        const dashboardResponse = await api.get('/api/dashboard');
        console.log('Dashboard Status:', dashboardResponse.status);
        console.log('Dashboard Response:', JSON.stringify(dashboardResponse.data, null, 2));
      } catch (error) {
        console.log('Dashboard access failed:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
          console.log(JSON.stringify(error.response.data, null, 2));
        }
      }
    } else {
      console.log('Login failed.');
    }
  } catch (error) {
    console.error('Error during login:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

// Check for required modules
try {
  if (!require('axios') || !require('axios-cookiejar-support') || !require('tough-cookie')) {
    console.log('Required modules not found. Installing...');
    console.log('Run: npm install axios axios-cookiejar-support tough-cookie');
    process.exit(1);
  }
  
  testLogin();
} catch (e) {
  console.log('Required modules not found. Install with:');
  console.log('npm install axios axios-cookiejar-support tough-cookie');
} 