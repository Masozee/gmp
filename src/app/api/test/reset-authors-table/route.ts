import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"

export async function GET(request: NextRequest) {
  try {
    // Drop the authors table and recreate it with the correct schema
    await sqlite.transaction(async () => {
      // Check if tables exist before dropping
      const authorsTableExists = await sqlite.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='authors'"
      );
      
      const authorsPubTableExists = await sqlite.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='authors_on_publications'"
      );
      
      // Log current schema if table exists
      let currentSchema = null;
      if (authorsTableExists) {
        currentSchema = await sqlite.all("PRAGMA table_info(authors)");
      }

      // Drop existing tables (this will cascade delete related records)
      if (authorsPubTableExists) {
        await sqlite.run("DROP TABLE IF EXISTS authors_on_publications");
      }
      
      if (authorsTableExists) {
        await sqlite.run("DROP TABLE IF EXISTS authors");
      }
      
      // Create authors table with updated schema
      await sqlite.run(`
        CREATE TABLE IF NOT EXISTS authors (
          id TEXT PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phoneNumber TEXT,
          organization TEXT,
          bio TEXT,
          category TEXT NOT NULL,
          photoUrl TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )
      `);
      
      // Create indices
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email)");
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_authors_category ON authors(category)");
      
      // Create pivot table for publications
      await sqlite.run(`
        CREATE TABLE IF NOT EXISTS authors_on_publications (
          id TEXT PRIMARY KEY,
          publicationId TEXT NOT NULL,
          authorId TEXT NOT NULL,
          displayOrder INTEGER NOT NULL,
          role TEXT,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (publicationId) REFERENCES publications(id),
          FOREIGN KEY (authorId) REFERENCES authors(id),
          UNIQUE(publicationId, authorId)
        )
      `);
      
      // Create pivot table indices
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_authors_publications_pub ON authors_on_publications(publicationId)");
      await sqlite.run("CREATE INDEX IF NOT EXISTS idx_authors_publications_author ON authors_on_publications(authorId)");
      
      // Create sample data
      const now = new Date().toISOString();
      
      // Sample authors
      const sampleAuthors = [
        {
          id: sqlite.generateId(),
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          phoneNumber: "+1234567890",
          organization: "University of Example",
          bio: "Jane is a researcher specializing in political science",
          category: "RESEARCHER",
          photoUrl: "/images/placeholders/author.jpg",
          createdAt: now,
          updatedAt: now
        },
        {
          id: sqlite.generateId(),
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@example.com",
          phoneNumber: "+1987654321",
          organization: "Politics Institute",
          bio: "John is a senior fellow at the Politics Institute",
          category: "AUTHOR",
          photoUrl: "/images/placeholders/author.jpg",
          createdAt: now,
          updatedAt: now
        }
      ];
      
      for (const author of sampleAuthors) {
        await sqlite.run(`
          INSERT INTO authors (
            id, firstName, lastName, email, phoneNumber, organization, 
            bio, category, photoUrl, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          author.id, author.firstName, author.lastName, author.email,
          author.phoneNumber, author.organization, author.bio,
          author.category, author.photoUrl, author.createdAt, author.updatedAt
        ]);
      }
    });
    
    // Get the authors to confirm creation
    const authors = await sqlite.all("SELECT * FROM authors");
    const tableInfo = await sqlite.all("PRAGMA table_info(authors)");
    
    return NextResponse.json({
      success: true,
      message: "Authors table reinitialized successfully",
      schema: tableInfo,
      authors: authors
    });
  } catch (error) {
    console.error("Failed to reset authors table:", error);
    return NextResponse.json({
      error: "Failed to reset authors table",
      details: String(error)
    }, { status: 500 });
  }
} 