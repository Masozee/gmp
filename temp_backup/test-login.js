/**
 * Script to test login with the admin user
 */

async function testLogin() {
  try {
    console.log('Testing login for user: admin@example.com');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    });
    
    const data = await response.json();
    
    console.log('Status Code:', response.status);
    console.log('Response Headers:', Object.fromEntries([...response.headers.entries()]));
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 200 && data.success) {
      console.log('Login successful!');
    } else {
      console.log('Login failed.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin(); 