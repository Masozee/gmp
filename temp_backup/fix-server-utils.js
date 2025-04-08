/**
 * This script removes 'use server' directives from server utility files
 * that export objects, as they're causing build issues.
 */

const fs = require('fs');
const path = require('path');

// Server utility files to process
const serverUtils = [
  'src/lib/server-jwt.ts',
  'src/lib/logger.ts',
  'src/lib/server-auth.ts'
];

let fixedCount = 0;

// Process each file
serverUtils.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }

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

console.log(`\nFixed ${fixedCount} server utility files.`); 