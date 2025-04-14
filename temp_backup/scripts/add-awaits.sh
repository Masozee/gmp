#!/bin/bash

# Find all route.ts files in API directories
find src/app/api -name "route.ts" -type f | while read -r file; do
  echo "Adding awaits to SQLite calls in $file"
  # Add await to sqlite function calls
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.get/\1await sqlite.get/g' "$file"
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.all/\1await sqlite.all/g' "$file"
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.run/\1await sqlite.run/g' "$file"
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.each/\1await sqlite.each/g' "$file"
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.paginate/\1await sqlite.paginate/g' "$file"
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.transaction/\1await sqlite.transaction/g' "$file"
  sed -i '' 's/\(const[^=]*=[^=]*\)sqlite\.prepareStatement/\1await sqlite.prepareStatement/g' "$file"
  
  # Add await to direct function calls
  sed -i '' 's/return sqlite\.transaction/return await sqlite.transaction/g' "$file"
  sed -i '' 's/await sqlite\.transaction([^)]*) {/await sqlite.transaction(async () => {/g' "$file"
  
  # Add await to variable assignments
  sed -i '' 's/\([a-zA-Z0-9_]*\) = sqlite\.get/\1 = await sqlite.get/g' "$file"
  sed -i '' 's/\([a-zA-Z0-9_]*\) = sqlite\.all/\1 = await sqlite.all/g' "$file"
  sed -i '' 's/\([a-zA-Z0-9_]*\) = sqlite\.run/\1 = await sqlite.run/g' "$file"
done

echo "All SQLite calls have been updated with await." 