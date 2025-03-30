// Script to test the API endpoints
// Run with: node scripts/test-api.js

const http = require('http');
const https = require('https');

// Base URL for local development
const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
async function makeRequest(endpoint, method = 'GET', data = null) {
  // Ensure endpoint starts with /api/
  if (!endpoint.startsWith('/api/')) {
    endpoint = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }
  
  const url = new URL(endpoint, BASE_URL);
  
  console.log(`Requesting ${url} with headers:`);
  
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Test': 'true'
      },
    };
    
    console.log(options.headers);
    
    // Choose http or https based on URL
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(url, options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        let parsed;
        
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body.substring(0, 500) + '...';
        }
        
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
          rawData: body
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Function to test endpoints
async function testEndpoints() {
  try {
    console.log('=== Testing API Endpoints ===\n');
    
    // Test event-categories endpoint
    console.log('Testing: GET /api/event-categories');
    const categoriesResponse = await makeRequest('/event-categories');
    console.log(`Status: ${categoriesResponse.status}`);
    console.log(`Content-Type: ${categoriesResponse.headers['content-type'] || 'not specified'}`);
    if (typeof categoriesResponse.data === 'object') {
      console.log(`Data: ${JSON.stringify(categoriesResponse.data, null, 2)}`);
    } else {
      console.log(`Data: ${categoriesResponse.data.substring(0, 200)}...`);
    }
    console.log('\n----------------------------\n');
    
    // Test events endpoint
    console.log('Testing: GET /api/events');
    const eventsResponse = await makeRequest('/events');
    console.log(`Status: ${eventsResponse.status}`);
    console.log(`Content-Type: ${eventsResponse.headers['content-type'] || 'not specified'}`);
    if (typeof eventsResponse.data === 'object') {
      console.log(`Data: ${JSON.stringify(eventsResponse.data, null, 2)}`);
    } else {
      console.log(`Data: ${eventsResponse.data.substring(0, 200)}...`);
    }
    console.log('\n----------------------------\n');
    
    // Test publications endpoint
    console.log('Testing: GET /api/publications');
    const publicationsResponse = await makeRequest('/publications');
    console.log(`Status: ${publicationsResponse.status}`);
    console.log(`Content-Type: ${publicationsResponse.headers['content-type'] || 'not specified'}`);
    if (typeof publicationsResponse.data === 'object') {
      console.log(`Data: ${JSON.stringify(publicationsResponse.data, null, 2)}`);
    } else {
      console.log(`Data: ${publicationsResponse.data.substring(0, 200)}...`);
    }
    console.log('\n----------------------------\n');
    
    // Test users endpoint
    console.log('Testing: GET /api/users');
    const usersResponse = await makeRequest('/users');
    console.log(`Status: ${usersResponse.status}`);
    console.log(`Content-Type: ${usersResponse.headers['content-type'] || 'not specified'}`);
    if (typeof usersResponse.data === 'object') {
      console.log(`Data: ${JSON.stringify(usersResponse.data, null, 2)}`);
    } else {
      console.log(`Data: ${usersResponse.data.substring(0, 200)}...`);
    }
    console.log('\n----------------------------\n');
    
    console.log('API Tests Completed!');
    
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }
}

// Execute tests after a short delay to allow the server to start
setTimeout(() => {
  testEndpoints();
}, 3000);

console.log('Waiting for server to be ready...'); 