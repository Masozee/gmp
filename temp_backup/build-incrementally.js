const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// List all route files
const findRouteFiles = () => {
  try {
    const output = execSync('find src/app/api -name "route.ts"').toString();
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding route files:', error);
    return [];
  }
};

// Main function
const main = async () => {
  // First, remove .next directory
  try {
    execSync('rm -rf .next');
    console.log('Cleaned .next directory');
  } catch (error) {
    console.error('Error cleaning .next directory:', error);
  }

  // Get all route files
  const routeFiles = findRouteFiles();
  console.log(`Found ${routeFiles.length} route files`);
  
  // Create a temp directory to move files
  const tempDir = path.join(__dirname, 'temp_routes');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Move all route files to temp directory
  for (const file of routeFiles) {
    const destPath = path.join(tempDir, path.basename(file));
    fs.copyFileSync(file, destPath);
    fs.writeFileSync(file, `"use server"

export async function GET() {
  return new Response("Temporary file", { status: 200 });
}
`);
  }
  
  console.log('Moved all route files to temp directory');
  
  // Try to build with all route files replaced
  try {
    console.log('Attempting build with temporary route files...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build succeeded with temporary route files');
  } catch (error) {
    console.error('Error building with temporary route files:', error.message);
    // Restore all files and exit if we can't even build with temporary files
    for (const file of routeFiles) {
      const sourcePath = path.join(tempDir, path.basename(file));
      fs.copyFileSync(sourcePath, file);
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('Restored all route files and exiting');
    process.exit(1);
  }
  
  // Now restore files one by one and test
  let failedFiles = [];
  
  for (const file of routeFiles) {
    const fileName = path.basename(file);
    const dirName = path.dirname(file);
    console.log(`Testing file: ${file}`);
    
    // Restore the original file
    const sourcePath = path.join(tempDir, fileName);
    fs.copyFileSync(sourcePath, file);
    
    // Try to build
    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log(`✅ File ${file} passed`);
    } catch (error) {
      console.error(`❌ File ${file} failed: ${error.message}`);
      failedFiles.push(file);
      
      // Replace with temporary file again
      fs.writeFileSync(file, `"use server"

export async function GET() {
  return new Response("Temporary file", { status: 200 });
}
`);
    }
  }
  
  // Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  // Restore all files
  for (const file of routeFiles) {
    const sourcePath = path.join(tempDir, path.basename(file));
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, file);
    }
  }
  
  if (failedFiles.length > 0) {
    console.log('Failed files:');
    failedFiles.forEach(file => console.log(`- ${file}`));
    process.exit(1);
  } else {
    console.log('All files passed!');
    process.exit(0);
  }
};

main().catch(console.error); 