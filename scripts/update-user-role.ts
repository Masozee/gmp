import { initializeDatabase, db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function updateUserRole() {
  console.log('Updating user role...');
  
  try {
    // Initialize database first
    initializeDatabase();
    
    // Update user role
    const [updatedUser] = await db.update(users)
      .set({ 
        role: 'admin',
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.email, 'nurojilukmansyah@gmail.com'))
      .returning();
    
    if (updatedUser) {
      console.log('✅ Successfully updated user role:', {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      });
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    throw error;
  }
}

// Run the update
updateUserRole().catch(console.error); 