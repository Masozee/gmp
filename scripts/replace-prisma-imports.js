// This script replaces Prisma imports with SQLite imports in API route files
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all API route files
const apiDir = path.join(__dirname, '../src/app/api');

// Function to process a file
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip files that already use sqlite
  if (content.includes('import sqlite from')) {
    console.log(`  Already uses SQLite, skipping`);
    return;
  }
  
  // Check if the file imports from prisma
  const hasPrismaImport = content.includes('import { prisma }') || 
                          content.includes('import prisma from');
  
  if (!hasPrismaImport) {
    console.log(`  No prisma import found, skipping`);
    return;
  }
  
  // Replace the prisma imports with sqlite
  content = content.replace(/import\s+{\s*prisma\s*}\s+from\s+["']@\/lib\/prisma["']/g, 
                          'import sqlite from "@/lib/sqlite"');
  content = content.replace(/import\s+prisma\s+from\s+["']@\/lib\/prisma["']/g, 
                          'import sqlite from "@/lib/sqlite"');
  
  // Replace prisma.modelName with direct SQLite calls
  content = content.replace(/prisma\.([\w]+)\.findUnique/g, 'sqlite.get(`SELECT * FROM $1 WHERE');
  content = content.replace(/prisma\.([\w]+)\.findMany/g, 'sqlite.all(`SELECT * FROM $1');
  content = content.replace(/prisma\.([\w]+)\.findFirst/g, 'sqlite.get(`SELECT * FROM $1');
  content = content.replace(/prisma\.([\w]+)\.create/g, 'sqlite.run(`INSERT INTO $1');
  content = content.replace(/prisma\.([\w]+)\.update/g, 'sqlite.run(`UPDATE $1 SET');
  content = content.replace(/prisma\.([\w]+)\.delete/g, 'sqlite.run(`DELETE FROM $1 WHERE');
  content = content.replace(/prisma\.([\w]+)\.count/g, 'sqlite.get(`SELECT COUNT(*) as count FROM $1');
  
  // Write the file back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Updated to use SQLite`);
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