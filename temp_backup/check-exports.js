const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all route files
const findRouteFiles = () => {
  try {
    const output = execSync('find src/app/api -name "route.ts"').toString();
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding route files:', error);
    return [];
  }
};

// Check all route files for non-async exports
const checkNonAsyncExports = (files) => {
  const problematicFiles = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    // This regex will match export declarations that aren't functions or async functions
    const nonAsyncExportRegex = /export\s+(?!async\s+function)(?!function)(?!type)(?!interface)(?!const\s+\w+\s*:\s*(?:React\.)?FC)(?!enum)(\w+|\{[^}]+\})\s*(?:=|;|$)/g;
    
    const matches = content.match(nonAsyncExportRegex);
    if (matches) {
      problematicFiles.push({
        file,
        exports: matches
      });
    }
  }

  return problematicFiles;
};

// Main function
const main = () => {
  const routeFiles = findRouteFiles();
  console.log(`Found ${routeFiles.length} route files`);

  const problematicFiles = checkNonAsyncExports(routeFiles);
  
  if (problematicFiles.length === 0) {
    console.log('No problematic exports found!');
    return;
  }
  
  console.log(`Found ${problematicFiles.length} files with potentially problematic exports:`);
  
  for (const { file, exports } of problematicFiles) {
    console.log(`\nFile: ${file}`);
    console.log('Problematic exports:');
    exports.forEach(exp => console.log(`  - ${exp.trim()}`));
  }
};

main(); 