import sqlite3
from collections import defaultdict

def remove_duplicates():
    # Connect to the database
    conn = sqlite3.connect('database.sqlite')
    cursor = conn.cursor()
    
    # Function to remove duplicates from a table
    def deduplicate_table(table_name, fields):
        print(f"\nProcessing {table_name}...")
        
        # Get all records
        cursor.execute(f"SELECT id, {', '.join(fields)} FROM {table_name}")
        records = cursor.fetchall()
        
        # Create a dictionary to store unique records
        seen = defaultdict(list)
        for record in records:
            record_id = record[0]
            # Create a tuple of fields to check for duplicates
            key = tuple(record[1:])
            seen[key].append(record_id)
        
        # Find and remove duplicates
        duplicates_found = 0
        for key, ids in seen.items():
            if len(ids) > 1:
                # Keep the first occurrence (lowest ID) and delete the rest
                keep_id = min(ids)
                delete_ids = [id for id in ids if id != keep_id]
                
                # Delete duplicate records
                placeholders = ','.join('?' * len(delete_ids))
                cursor.execute(f"DELETE FROM {table_name} WHERE id IN ({placeholders})", delete_ids)
                
                duplicates_found += len(delete_ids)
                print(f"Found duplicates for {key}: keeping ID {keep_id}, removing IDs {delete_ids}")
        
        return duplicates_found

    try:
        # Remove duplicates from organization_staff
        staff_duplicates = deduplicate_table('organization_staff', ['name', 'position'])
        print(f"\nRemoved {staff_duplicates} duplicate staff members")

        # Remove duplicates from board_members
        board_duplicates = deduplicate_table('board_members', ['name', 'position'])
        print(f"Removed {board_duplicates} duplicate board members")

        # Commit the changes
        conn.commit()
        print("\nDuplicate removal completed successfully!")

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    remove_duplicates() 