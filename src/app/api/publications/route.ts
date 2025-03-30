import { NextRequest, NextResponse } from "next/server"
import sqlite from "@/lib/sqlite"
import { getServerSession } from "@/lib/server-auth"
import slugify from "slugify"
import { writeFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { randomUUID } from "crypto"
// Import the database initialization module
import "@/lib/initialize"

// PublicationStatus enum
export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable authentication for testing
    // const session = await getServerSession()
    // 
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'updatedAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const { offset, limit: validLimit } = sqlite.paginate(page, limit);

    // Build the SQL query with proper filters
    let query = `
      SELECT 
        p.id, p.title, p.slug, p.abstract, p.content, p.publicationDate,
        p.coverImage, p.imageCredit, p.published, p.categoryId,
        p.createdAt, p.updatedAt,
        c.id as category_id, c.name as category_name
      FROM publications p
      LEFT JOIN event_categories c ON p.categoryId = c.id
      WHERE 1=1
    `;
    
    const params: any[] = [];

    // Add search filter
    if (search) {
      query += ` AND (p.title LIKE ? OR p.abstract LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // Add status filter
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    // Add category filter
    if (category) {
      query += ` AND p.categoryId = ?`;
      params.push(category);
    }

    // Add order by clause
    const validSortColumns = ["title", "publicationDate", "createdAt", "updatedAt"];
    const validOrderValues = ["asc", "desc"];
    
    const sortField = validSortColumns.includes(sort) ? sort : "updatedAt";
    const orderDirection = validOrderValues.includes(order.toLowerCase()) ? order.toLowerCase() : "desc";
    
    query += ` ORDER BY p.${sortField} ${orderDirection}`;
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(validLimit, offset);

    // Execute the query
    const publications = sqlite.all(query, params);
    
    // Get the total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM publications p
      WHERE 1=1
    `;
    
    let countParams: any[] = [];
    
    if (search) {
      countQuery += ` AND (p.title LIKE ? OR p.abstract LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (status) {
      countQuery += ` AND p.status = ?`;
      countParams.push(status);
    }
    
    if (category) {
      countQuery += ` AND p.categoryId = ?`;
      countParams.push(category);
    }
    
    const countResult = sqlite.get<{ total: number }>(countQuery, countParams);
    const total = countResult?.total || 0;

    // For each publication, fetch authors
    for (const publication of publications) {
      // Get authors for this publication
      const authorsQuery = `
        SELECT a.id, a.firstName, a.lastName, a.title, a.organization, a.photoUrl
        FROM authors_on_publications ap
        JOIN authors a ON ap.authorId = a.id
        WHERE ap.publicationId = ?
        ORDER BY ap.displayOrder ASC
      `;
      
      publication.authors = sqlite.all(authorsQuery, [publication.id]) || [];
      
      // Get tags for this publication
      const tagsQuery = `
        SELECT t.id, t.name, t.slug
        FROM tags_on_publications tp
        JOIN tags t ON tp.tagId = t.id
        WHERE tp.publicationId = ?
      `;
      
      publication.tags = sqlite.all(tagsQuery, [publication.id]) || [];
      
      // Format the category
      if (publication.category_id) {
        publication.category = {
          id: publication.category_id,
          name: publication.category_name
        };
      } else {
        publication.category = null;
      }
      
      // Clean up redundant fields
      delete publication.category_id;
      delete publication.category_name;
    }
    
    return NextResponse.json({
      publications,
      pagination: {
        total,
        page,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      }
    });
  } catch (error) {
    console.error("Failed to fetch publications:", error)
    return NextResponse.json(
      { error: "Failed to fetch publications", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("Session user:", session.user)
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const content = formData.get("content") as string
    const coverImage = formData.get("coverImage") as File | null
    const coverCredit = formData.get("coverCredit") as string | null
    const files = formData.getAll("files") as File[]
    
    console.log("Form data:", {
      title,
      description,
      content,
      coverCredit,
      hasFiles: files.length > 0
    })

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get author IDs from form data
    const authorIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("authors[") && key.endsWith("]")) {
        authorIds.push(value as string)
      }
    }

    // Get category IDs from form data
    const categoryIds: string[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("categories[") && key.endsWith("]")) {
        categoryIds.push(value as string)
      }
    }

    console.log("Author IDs:", authorIds)
    console.log("Category IDs:", categoryIds)

    // Get the user's profile
    let profile = sqlite.get(
      "SELECT * FROM users WHERE email = ?",
      [session.user.email.toLowerCase()]
    );

    console.log("Found profile:", profile)

    // If profile doesn't exist, create one automatically
    if (!profile) {
      console.log("Creating new profile for user")
      const now = new Date().toISOString();
      const userId = randomUUID();
      
      sqlite.run(
        "INSERT INTO users (id, email, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        [
          userId,
          session.user.email.toLowerCase(),
          session.user.email.split('@')[0],
          'AUTHOR',
          now,
          now
        ]
      );
      
      profile = sqlite.get(
        "SELECT * FROM users WHERE email = ?",
        [session.user.email.toLowerCase()]
      );
      
      console.log("Created profile:", profile)
    }

    // Add the current user as an author if not already included
    if (!authorIds.includes(profile.id)) {
      authorIds.push(profile.id)
    }

    console.log("Final author IDs:", authorIds)

    // Remove duplicate author IDs
    const uniqueAuthorIds = [...new Set(authorIds)]

    // Generate a unique slug from the title
    const baseSlug = slugify(title, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1

    // Keep checking until we find a unique slug
    let existingPublication = sqlite.get(
      "SELECT slug FROM publications WHERE slug = ?",
      [slug]
    );

    while (existingPublication) {
      slug = `${baseSlug}-${counter}`
      counter++
      existingPublication = sqlite.get(
        "SELECT slug FROM publications WHERE slug = ?",
        [slug]
      );
    }

    let coverImageUrl: string | undefined

    // Handle cover image upload
    if (coverImage) {
      const bytes = await coverImage.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const filename = `${uniqueSuffix}-${coverImage.name}`
      const uploadDir = join(cwd(), "public", "uploads")
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      coverImageUrl = `/uploads/${filename}`
    }

    // Handle file uploads
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const filename = `${uniqueSuffix}-${file.name}`
        const uploadDir = join(cwd(), "public", "uploads")
        const filepath = join(uploadDir, filename)

        await writeFile(filepath, buffer)

        return {
          name: file.name,
          url: `/uploads/${filename}`,
          size: file.size,
          type: file.type,
        }
      })
    )

    // Generate a unique ID for the publication
    const publicationId = randomUUID();
    const now = new Date().toISOString();
    
    // Insert the new publication using SQLite
    sqlite.run(`
      INSERT INTO publications (
        id, title, slug, abstract, content, publicationDate, 
        coverImage, imageCredit, published, categoryId,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      publicationId,
      title,
      slug,
      description,
      content,
      now, // publicationDate
      coverImageUrl || null,
      coverCredit || null,
      0, // published (default to draft)
      categoryIds.length > 0 ? categoryIds[0] : null, // use first category as primary if available
      now,
      now
    ]);
    
    // Set the publication object for further operations
    const publication = {
      id: publicationId,
      title,
      slug,
      description,
      content,
      publicationDate: now,
      coverImage: coverImageUrl,
      coverCredit,
      published: 0,
      categoryId: categoryIds.length > 0 ? categoryIds[0] : null,
      createdAt: now,
      updatedAt: now
    };

    // Add authors if provided
    if (uniqueAuthorIds.length > 0) {
      for (const authorId of uniqueAuthorIds) {
        const authorRelationId = randomUUID();
        
        sqlite.run(`
          INSERT INTO authors_on_publications (
            id, publicationId, authorId, displayOrder, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          authorRelationId,
          publicationId,
          authorId,
          uniqueAuthorIds.indexOf(authorId), // Use index as display order
          now,
          now
        ]);
      }
    }

    // Associate categories with the publication
    if (categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        sqlite.run(
          "INSERT INTO categories_on_publications (publicationId, categoryId, createdAt) VALUES (?, ?, ?)",
          [publication.id, categoryId, new Date().toISOString()]
        );
      }
    }

    // Add files if provided
    if (uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const fileId = randomUUID();
        sqlite.run(
          "INSERT INTO publication_files (id, name, url, size, type, publicationId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            fileId,
            file.name,
            file.url,
            file.size,
            file.type,
            publication.id,
            new Date().toISOString(),
            new Date().toISOString()
          ]
        );
      }
    }

    // Fetch the complete publication with basic information
    const completePublication = sqlite.get(
      `
      SELECT
        p.*, c.name as categoryName
      FROM publications p
      LEFT JOIN event_categories c ON p.categoryId = c.id
      WHERE p.id = ?
      `,
      [publication.id]
    );

    // Add authors information
    const publicationAuthors = sqlite.all(
      `
      SELECT a.*, ap.role, ap.displayOrder
      FROM authors a
      JOIN authors_on_publications ap ON a.id = ap.authorId
      WHERE ap.publicationId = ?
      ORDER BY ap.displayOrder ASC
      `,
      [publication.id]
    );

    // Add files information
    const publicationFiles = sqlite.all(
      `
      SELECT id, name, url, size, type
      FROM publication_files
      WHERE publicationId = ?
      `,
      [publication.id]
    );

    return NextResponse.json({
      publication: {
        ...completePublication,
        authors: publicationAuthors,
        files: publicationFiles
      }
    });
  } catch (error) {
    console.error("Failed to create publication:", error)
    return NextResponse.json(
      { error: "Failed to create publication", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 