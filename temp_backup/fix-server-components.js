const fs = require('fs');
const path = require('path');

// Process events/route.ts file
function fixEventsRouteFile() {
  const filePath = path.join(__dirname, 'src/app/api/events/route.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove all export enums and interface declarations
  content = content.replace(/\/\/ EventStatus enum[\s\S]*?}\s*/, '');
  content = content.replace(/\/\/ Define types for the speakers and tags[\s\S]*?interface EventSpeaker[\s\S]*?}\s*/, '');
  content = content.replace(/interface EventTag[\s\S]*?}\s*/, '');
  content = content.replace(/export interface EventWithRelations[\s\S]*?}\s*/, '');
  content = content.replace(/\/\/ Event without relations[\s\S]*?interface EventRecord[\s\S]*?}\s*/, '');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed events/route.ts file');
}

// Process profiles/route.ts file
function fixProfilesRouteFile() {
  const filePath = path.join(__dirname, 'src/app/api/profiles/route.ts');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the UserCategory import if needed
    if (!content.includes('import { UserCategory }')) {
      content = content.replace(
        /import(.*)from/,
        'import $1, { UserCategory } from "@/types/enums"\nimport'
      );
    }
    
    // Remove any local enum declarations
    content = content.replace(/export enum UserCategory[\s\S]*?}\s*/, '');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed profiles/route.ts file');
  }
}

// Process all route files that might contain enum exports
function fixAllRouteFiles() {
  const files = [
    'src/app/api/auth/register/route.ts',
    'src/app/api/authors/route.ts',
    'src/app/api/events/route.ts',
    'src/app/api/people/route.ts',
    'src/app/api/profiles/route.ts'
  ];

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if the file has the use server directive
      if (!content.startsWith('"use server"')) {
        content = '"use server"\n' + content;
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Checked/fixed ${file}`);
    }
  });
}

// Run the fixes
fixEventsRouteFile();
fixProfilesRouteFile();
fixAllRouteFiles();

console.log('All fixes applied!'); 