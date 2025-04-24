// Script to add a project via the API
const fetch = require('node-fetch');

async function main() {
  try {
    // Step 1: Login to get authentication token
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nurojilukmansyah@gmail.com',
        password: 'B6585esp__',
      }),
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    
    const token = loginData.token || loginData.data?.token;
    
    if (!token) {
      throw new Error('No token received from login');
    }
    
    console.log('Successfully logged in and received token');

    // Step 2: Create a new project
    console.log('Creating new project...');
    const projectResponse = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'API Created Project',
        description: 'This project was created through the API',
        status: 'ACTIVE',
        startDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }),
    });

    const projectData = await projectResponse.json();
    
    if (!projectResponse.ok) {
      throw new Error(`Project creation failed: ${JSON.stringify(projectData)}`);
    }
    
    console.log('Project created successfully:');
    console.log(JSON.stringify(projectData, null, 2));
    
    // Step 3: Fetch all projects to verify
    console.log('\nFetching all projects...');
    const projectsResponse = await fetch('http://localhost:3000/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const projectsData = await projectsResponse.json();
    
    if (!projectsResponse.ok) {
      throw new Error(`Failed to fetch projects: ${JSON.stringify(projectsData)}`);
    }
    
    console.log(`Found ${projectsData.data?.length || 0} projects:`);
    console.log(JSON.stringify(projectsData.data?.map(p => ({ id: p.id, title: p.title })), null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
