import { NextResponse } from 'next/server';
import initDatabase from '@/lib/init-database';

// This route can be called to initialize and optimize the database
export async function GET() {
  try {
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully with optimizations and indices',
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 