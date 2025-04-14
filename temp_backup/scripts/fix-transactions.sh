#!/bin/bash

# Find all route.ts files in API directories
find src/app/api -name "route.ts" -type f | while read -r file; do
  echo "Fixing transaction callbacks in $file"
  # Replace transaction callbacks with async callbacks
  sed -i '' 's/sqlite\.transaction(\([^)]*\)) {/sqlite.transaction(async \1) {/g' "$file"
  # Fix double awaits
  sed -i '' 's/await await/await/g' "$file"
  
  # Add await to statement runs
  sed -i '' 's/\([a-zA-Z0-9_]*Stmt\)\.run(/await \1.run(/g' "$file"
  
  # Fix speaker mapping in events/route.ts
  if [[ "$file" == *"events/route.ts" ]]; then
    sed -i '' 's/const speakers = await sqlite\.all\([^)]*\))\.map(/const speakerResults = await sqlite.all\1;\n        const speakers = speakerResults.map(/g' "$file"
  fi
done

echo "All transaction callbacks have been updated." 