/**
 * Super simple login test using only axios
 */
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login for user: admin@example.com');
    
    // Login and get the token
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginResponse.data, null, 2));
    
    // Get the Set-Cookie header from the response
    const setCookieHeader = loginResponse.headers['set-cookie'];
    console.log('Set-Cookie Header:', setCookieHeader);
    
    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('Login successful!');
      
      if (setCookieHeader) {
        // Extract token from the Set-Cookie header
        const tokenCookie = setCookieHeader.find(cookie => cookie.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split(';')[0].split('=')[1] : null;
        
        if (token) {
          console.log('Token retrieved from cookie:', token.substring(0, 20) + '...');
          
          // Try to access dashboard with token
          console.log('\nTrying to access dashboard with token cookie...');
          try {
            const dashboardResponse = await axios.get('http://localhost:3002/api/dashboard', {
              headers: {
                Cookie: `token=${token}`
              }
            });
            
            console.log('Dashboard Status:', dashboardResponse.status);
            console.log('Dashboard Response:', JSON.stringify(dashboardResponse.data, null, 2));
          } catch (error) {
            console.log('Dashboard access failed:', error.response ? error.response.status : error.message);
            if (error.response && error.response.data) {
              console.log(JSON.stringify(error.response.data, null, 2));
            }
          }
        } else {
          console.log('No token found in cookies');
        }
      } else {
        console.log('No Set-Cookie header in response');
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

testLogin(); 