#!/bin/bash

# Find all route.ts files in API directories
find src/app/api -name "route.ts" -type f | while read -r file; do
  echo "Adding 'use server' to $file"
  # Check if the file already has "use server" directive
  if ! grep -q "use server" "$file"; then
    # Add "use server" directive at the top of the file
    echo '"use server"' | cat - "$file" > temp && mv temp "$file"
  fi
done

# Find all [id]/route.ts files in API directories
find src/app/api -name "[id]" -type d | while read -r dir; do
  file="$dir/route.ts"
  if [ -f "$file" ]; then
    echo "Adding 'use server' to $file"
    # Check if the file already has "use server" directive
    if ! grep -q "use server" "$file"; then
      # Add "use server" directive at the top of the file
      echo '"use server"' | cat - "$file" > temp && mv temp "$file"
    fi
  fi
done

echo "All API route files have been updated." 