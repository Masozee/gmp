import { initializeDatabase } from '../src/lib/db';
import { createUser } from '../src/lib/auth-utils';

async function initDB() {
  console.log('Initializing database...');
  
  // Initialize database and run migrations
  initializeDatabase();
  
  try {
    // Create default admin user
    const adminUser = await createUser(
      'admin@partisipasimuda.org',
      'admin123',
      'Administrator',
      'admin'
    );
    
    console.log('✅ Default admin user created:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    });
    
    console.log('\n📝 Default admin credentials:');
    console.log('Email: admin@partisipasimuda.org');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the default password after first login!');
    
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      console.log('ℹ️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin user:', error);
    }
  }
  
  console.log('Database initialization complete!');
}

initDB().catch(console.error); 