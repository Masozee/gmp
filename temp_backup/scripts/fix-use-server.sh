#!/bin/bash

# Find all route.ts files in API directories
find src/app/api -name "route.ts" -type f | while read -r file; do
  echo "Fixing use server directive in $file"
  # Replace any 'use server'; with 'use server'
  sed -i '' 's/"use server";/"use server"/g' "$file"
done

echo "All use server directives have been fixed." 