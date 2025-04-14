// Script to test the API endpoints
// Run with: node scripts/test-api.js

const http = require('http');
const https = require('https');
const { randomUUID } = require('crypto');

// Base URL for local development
const BASE_URL = 'http://localhost:3000';

// Test authentication token (should be set via environment variable in real usage)
const TEST_TOKEN = "test-auth-token";

// Helper function to make HTTP requests
async function makeRequest(endpoint, method = 'GET', data = null) {
  // Ensure endpoint starts with /api/
  if (!endpoint.startsWith('/api/')) {
    endpoint = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }
  
  const url = new URL(endpoint, BASE_URL);
  
  console.log(`\n[${method}] ${url.toString()}`);
  
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${TEST_TOKEN}`,
        'X-API-Test': 'true'
      },
    };
    
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
          parsed = body;
        }
        
        console.log(`✓ Status: ${res.statusCode} ${res.statusMessage}`);
        
        // Pretty print the response data
        if (typeof parsed === 'object') {
          console.log('Response:', JSON.stringify(parsed, null, 2));
        } else {
          console.log('Response:', parsed.substring(0, 200) + (parsed.length > 200 ? '...' : ''));
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
      console.error(`❌ Error: ${error.message}`);
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Create an event for testing
async function createTestEvent() {
  const eventData = {
    title: `Test Event ${new Date().toISOString().split('T')[0]}`,
    description: "This is a test event created by the API test script",
    location: "Test Location",
    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    status: "DRAFT"
  };
  
  console.log("\n=== Creating Test Event ===");
  const response = await makeRequest('/events', 'POST', eventData);
  
  if (response.status === 201 && response.data.data && response.data.data.id) {
    console.log(`✓ Test event created with ID: ${response.data.data.id}`);
    return response.data.data.id;
  } else {
    console.error("❌ Failed to create test event");
    return null;
  }
}

// Function to test endpoints
async function testEndpoints() {
  try {
    console.log('=== Testing API Endpoints ===\n');
    
    // Test events list endpoint
    console.log('=== Testing: GET /api/events ===');
    const eventsResponse = await makeRequest('/events');
    console.log(`✓ Success: ${eventsResponse.status === 200}`);
    
    // Create a test event
    const eventId = await createTestEvent();
    
    if (eventId) {
      // Test getting a single event
      console.log(`\n=== Testing: GET /api/events/${eventId} ===`);
      const eventResponse = await makeRequest(`/events/${eventId}`);
      console.log(`✓ Success: ${eventResponse.status === 200}`);
      
      // Test updating the event
      console.log(`\n=== Testing: PATCH /api/events/${eventId} ===`);
      const updateData = {
        title: `Updated Test Event ${new Date().toISOString().split('T')[0]}`,
        description: "This event was updated by the API test script",
        location: "Updated Location"
      };
      
      const updateResponse = await makeRequest(`/events/${eventId}`, 'PATCH', updateData);
      console.log(`✓ Success: ${updateResponse.status === 200}`);
      
      // Test deleting the event
      console.log(`\n=== Testing: DELETE /api/events/${eventId} ===`);
      const deleteResponse = await makeRequest(`/events/${eventId}`, 'DELETE');
      console.log(`✓ Success: ${deleteResponse.status === 204}`);
    }
    
    console.log('\n=== API Tests Completed! ===');
    
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }
}

// Run the tests
testEndpoints(); 