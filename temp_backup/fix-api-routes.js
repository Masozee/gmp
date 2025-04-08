/**
 * This script removes 'use server' directives from API route files
 * since they don't need it and it's causing issues with the build.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all API route files
const apiRouteFiles = glob.sync('src/app/api/**/route.ts');
console.log(`Found ${apiRouteFiles.length} API route files`);

let fixedCount = 0;

// Process each file
apiRouteFiles.forEach(file => {
  console.log(`Processing ${file}`);
  
  // Read file content
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if the file has the use server directive
  if (content.startsWith('"use server"') || content.startsWith('"use server";')) {
    // Remove the directive
    content = content
      .replace('"use server"\n', '')
      .replace('"use server";\n', '')
      .replace('"use server"', '')
      .replace('"use server";', '');
    
    // Write the file back
    fs.writeFileSync(file, content);
    
    fixedCount++;
    console.log(`Fixed ${file}`);
  }
});

console.log(`\nFixed ${fixedCount} API route files.`); 