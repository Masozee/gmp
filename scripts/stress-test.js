/**
 * Stress Test Script for API Endpoints
 * 
 * This script tests the performance of the API endpoints by sending multiple
 * concurrent requests and measuring the response times.
 */

const http = require('http');
const { performance } = require('perf_hooks');

// Configuration
const config = {
  host: 'localhost',
  port: 3000,
  endpoints: [
    { path: '/api/event-categories', method: 'GET', name: 'Event Categories' },
    { path: '/api/events', method: 'GET', name: 'Events' },
    { path: '/api/publications', method: 'GET', name: 'Publications' },
    { path: '/api/users', method: 'GET', name: 'Users' }
  ],
  concurrency: [10, 50, 100, 200, 300], // Increased concurrency for stress testing
  delay: 300, // Increased delay between batches
  timeout: 10000, // Increased timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Results storage
const results = {};

// Make a single request and return a promise
function makeRequest(endpoint, id) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    const options = {
      hostname: config.host,
      port: config.port,
      path: endpoint.path,
      method: endpoint.method,
      headers: config.headers,
      timeout: config.timeout
    };
    
    const req = http.request(options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const statusCode = res.statusCode;
        
        resolve({
          id,
          endpoint: endpoint.path,
          statusCode,
          duration,
          success: statusCode >= 200 && statusCode < 300
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      resolve({
        id,
        endpoint: endpoint.path,
        statusCode: 0,
        duration,
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      resolve({
        id,
        endpoint: endpoint.path,
        statusCode: 0,
        duration,
        success: false,
        error: 'Request timed out'
      });
    });
    
    req.end();
  });
}

// Make multiple concurrent requests
async function makeConcurrentRequests(endpoint, concurrency) {
  const requests = [];
  
  for (let i = 0; i < concurrency; i++) {
    requests.push(makeRequest(endpoint, i));
  }
  
  return Promise.all(requests);
}

// Calculate statistics from the results
function calculateStats(responseResults) {
  if (responseResults.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      median: 0,
      successRate: 0,
      count: 0,
      errors: {}
    };
  }
  
  const durations = responseResults.map(r => r.duration);
  const sortedDurations = [...durations].sort((a, b) => a - b);
  const successCount = responseResults.filter(r => r.success).length;
  
  // Count errors by type
  const errors = {};
  responseResults.filter(r => !r.success).forEach(r => {
    const errorMessage = r.error || `Status ${r.statusCode}`;
    errors[errorMessage] = (errors[errorMessage] || 0) + 1;
  });
  
  return {
    min: Math.min(...durations),
    max: Math.max(...durations),
    avg: durations.reduce((sum, val) => sum + val, 0) / durations.length,
    median: sortedDurations[Math.floor(sortedDurations.length / 2)],
    p95: sortedDurations[Math.floor(sortedDurations.length * 0.95)],
    p99: sortedDurations[Math.floor(sortedDurations.length * 0.99)],
    successRate: (successCount / responseResults.length) * 100,
    count: responseResults.length,
    errors
  };
}

// Format duration in ms
function formatDuration(ms) {
  return `${ms.toFixed(2)}ms`;
}

// Run tests for an endpoint with different concurrency levels
async function runEndpointTest(endpoint) {
  console.log(`\nTesting: ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
  console.log('-'.repeat(80));
  console.log('Concurrency | Min      | Max      | Avg      | Median   | P95      | P99      | Success Rate');
  console.log('-'.repeat(80));
  
  results[endpoint.path] = {};
  
  for (const concurrency of config.concurrency) {
    // Run the test
    const responseResults = await makeConcurrentRequests(endpoint, concurrency);
    
    // Calculate statistics
    const stats = calculateStats(responseResults);
    results[endpoint.path][concurrency] = stats;
    
    // Print results
    console.log(
      `${concurrency.toString().padEnd(11)} | ` +
      `${formatDuration(stats.min).padEnd(9)} | ` +
      `${formatDuration(stats.max).padEnd(9)} | ` +
      `${formatDuration(stats.avg).padEnd(9)} | ` +
      `${formatDuration(stats.median).padEnd(9)} | ` +
      `${formatDuration(stats.p95).padEnd(9)} | ` +
      `${formatDuration(stats.p99).padEnd(9)} | ` +
      `${stats.successRate.toFixed(2)}%`
    );
    
    // Wait a bit before the next batch
    await new Promise(resolve => setTimeout(resolve, config.delay));
  }
  
  // Print error summary if any
  const lastConcurrencyStats = results[endpoint.path][config.concurrency[config.concurrency.length - 1]];
  if (Object.keys(lastConcurrencyStats.errors).length > 0) {
    console.log('\nErrors at highest concurrency:');
    for (const [error, count] of Object.entries(lastConcurrencyStats.errors)) {
      console.log(`- ${error}: ${count} requests`);
    }
  }
}

// Run all tests
async function runTests() {
  console.log('=== API STRESS TEST ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Server: ${config.host}:${config.port}`);
  console.log(`Concurrency levels: ${config.concurrency.join(', ')}`);
  console.log(`Request timeout: ${config.timeout}ms`);
  
  const startTime = performance.now();
  
  for (const endpoint of config.endpoints) {
    await runEndpointTest(endpoint);
  }
  
  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('\n=== SUMMARY ===');
  console.log(`Total test duration: ${duration.toFixed(2)} seconds`);
  
  generateReport();
}

// Generate a final report
function generateReport() {
  console.log('\n=== DETAILED REPORT ===');
  
  // Calculate average success rates across all concurrency levels
  const avgSuccessRates = {};
  for (const endpoint of config.endpoints) {
    const endpointResults = results[endpoint.path];
    const successRates = Object.values(endpointResults).map(stats => stats.successRate);
    avgSuccessRates[endpoint.path] = successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length;
  }
  
  // Identify the max throughput for each endpoint (requests per second)
  const maxThroughput = {};
  for (const endpoint of config.endpoints) {
    const endpointResults = results[endpoint.path];
    const throughputs = Object.entries(endpointResults).map(([concurrency, stats]) => {
      return {
        concurrency: parseInt(concurrency),
        throughput: (stats.count / (stats.avg / 1000)) * (stats.successRate / 100)
      };
    });
    
    const maxThroughputEntry = throughputs.reduce((max, current) => 
      current.throughput > max.throughput ? current : max, 
      { concurrency: 0, throughput: 0 }
    );
    
    maxThroughput[endpoint.path] = maxThroughputEntry;
  }
  
  // Print the report
  console.log('Endpoint Performance Summary:');
  console.log('-'.repeat(80));
  console.log('Endpoint                | Avg Success Rate | Max Throughput     | Optimal Concurrency');
  console.log('-'.repeat(80));
  
  for (const endpoint of config.endpoints) {
    const path = endpoint.path;
    const avgSuccessRate = avgSuccessRates[path];
    const throughput = maxThroughput[path];
    
    console.log(
      `${path.padEnd(24)} | ` +
      `${avgSuccessRate.toFixed(2)}%`.padEnd(17) + ' | ' +
      `${throughput.throughput.toFixed(2)} req/sec`.padEnd(19) + ' | ' +
      `${throughput.concurrency}`
    );
  }
  
  // Recommendations based on the results
  console.log('\nRecommendations:');
  console.log('-'.repeat(80));
  
  const lowestPerformer = config.endpoints.reduce((lowest, endpoint) => {
    const current = maxThroughput[endpoint.path];
    const currentLowest = lowest ? maxThroughput[lowest.path] : { throughput: Infinity };
    return current.throughput < currentLowest.throughput ? endpoint : lowest;
  }, null);
  
  if (lowestPerformer) {
    console.log(`- The endpoint "${lowestPerformer.path}" has the lowest throughput and might need optimization.`);
  }
  
  // Check if any endpoint has a low success rate at high concurrency
  for (const endpoint of config.endpoints) {
    const highConcurrencyResults = results[endpoint.path][config.concurrency[config.concurrency.length - 1]];
    if (highConcurrencyResults.successRate < 90) {
      console.log(`- "${endpoint.path}" has a low success rate (${highConcurrencyResults.successRate.toFixed(2)}%) at high concurrency (${config.concurrency[config.concurrency.length - 1]}). Consider implementing rate limiting or optimizing this endpoint.`);
    }
  }
  
  // General recommendations
  console.log(`- Based on the tests, the application can handle approximately ${Object.values(maxThroughput).reduce((sum, t) => sum + t.throughput, 0).toFixed(2)} requests per second across all tested endpoints.`);
  console.log(`- For production deployment, implement proper rate limiting, caching, and consider horizontal scaling if needed.`);
}

// Start the tests
runTests().catch(console.error); 