import { NextRequest, NextResponse } from "next/server"
import { apiHandler } from "@/lib/api-helpers"
import sqlite from "@/lib/sqlite"

export async function GET(request: NextRequest) {
  return apiHandler.handleGetRequest({
    request,
    tableName: 'tags',
    searchFields: ['name', 'slug'],
    defaultSort: 'name',
    defaultOrder: 'asc'
  })
}

export async function POST(request: NextRequest) {
  return apiHandler.handlePostRequest({
    request,
    tableName: 'tags',
    requiredFields: ['name'],
    transform: (data) => {
      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      
      return {
        ...data,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },
    beforeInsert: async (data) => {
      // Check if tag with same name or slug already exists
      const existingTag = await sqlite.get(
        "SELECT id FROM tags WHERE name = ? OR slug = ?",
        [data.name, data.slug]
      )

      if (existingTag) {
        throw new Error("A tag with this name already exists")
      }

      return data
    }
  })
} 