// This script replaces @prisma/client imports with local types
const fs = require('fs');
const path = require('path');

// Get all API route files
const apiDir = path.join(__dirname, '../src/app/api');

// Function to process a file
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip files that don't have @prisma/client imports
  if (!content.includes('@prisma/client')) {
    console.log(`  No @prisma/client import found, skipping`);
    return;
  }
  
  // Create a map of prisma enums to add to the file
  let typesAdded = false;
  
  // Add enum definitions if they're in use
  const enumDefinitions = [];
  
  if (content.includes('UserRole')) {
    typesAdded = true;
    enumDefinitions.push(`// UserRole enum
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  CONTRIBUTOR = 'CONTRIBUTOR',
}`);
  }
  
  if (content.includes('UserCategory')) {
    typesAdded = true;
    enumDefinitions.push(`// UserCategory enum
export enum UserCategory {
  ACADEMIC = 'ACADEMIC',
  PRACTITIONER = 'PRACTITIONER',
  STUDENT = 'STUDENT',
  OTHER = 'OTHER',
}`);
  }
  
  if (content.includes('PublicationStatus')) {
    typesAdded = true;
    enumDefinitions.push(`// PublicationStatus enum
export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}`);
  }
  
  if (content.includes('EventStatus')) {
    typesAdded = true;
    enumDefinitions.push(`// EventStatus enum
export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}`);
  }
  
  // Replace the @prisma/client imports
  content = content.replace(/import\s+{\s*.*?\s*}\s+from\s+["']@prisma\/client["']/g, '');
  content = content.replace(/import\s+.*?\s+from\s+["']@prisma\/client["']/g, '');
  
  // Add the enum definitions to the top of the file if needed
  if (typesAdded) {
    const lines = content.split('\n');
    // Find the last import statement
    let lastImportLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportLine = i;
      }
    }
    
    // Insert the enum definitions after the last import
    lines.splice(lastImportLine + 1, 0, '', ...enumDefinitions, '');
    content = lines.join('\n');
    
    console.log(`  Added enum definitions`);
  }
  
  // Write the file back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Updated to remove @prisma/client imports`);
}

// Helper function to walk the directory recursively
function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recurse into subdirectory
      results = results.concat(walkDir(filePath));
    } else if (file.endsWith('.ts') && file.includes('route.ts')) {
      // Process API route files
      results.push(filePath);
    }
  });
  
  return results;
}

// Get all route files
const routeFiles = walkDir(apiDir);
console.log(`Found ${routeFiles.length} route files to process`);

// Process each file
routeFiles.forEach(processFile);

console.log('Done! Please review the changes before committing.'); 