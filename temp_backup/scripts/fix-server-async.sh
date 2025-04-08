#!/bin/bash

# Find all route.ts files in API directories
find src/app/api -name "route.ts" -type f | while read -r file; do
  echo "Adding async to functions in $file"
  # Use sed to make non-async exports async
  sed -i '' -E 's/export function ([A-Z]+)/export async function \1/g' "$file"
done

echo "All API route files have been updated." 