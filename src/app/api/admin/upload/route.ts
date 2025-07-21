import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { verifyAdmin } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Upload API called');
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type = data.get('type') as string; // 'image' or 'pdf'

    console.log('File received:', { 
      name: file?.name, 
      size: file?.size, 
      type: file?.type,
      uploadType: type 
    });

    if (!file) {
      console.log('No file in form data');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      pdf: ['application/pdf']
    };

    const validTypes = type === 'image' ? allowedTypes.image : allowedTypes.pdf;
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: ${validTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Determine if we're in production (on the server)
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Set upload directory based on environment
    let baseUploadDir;
    let publicUrlBase;
    
    if (isProduction) {
      // Use the server paths from environment variables
      baseUploadDir = process.env.UPLOAD_DIR || '/home/nurojilu/public_html/uploads';
      publicUrlBase = process.env.UPLOAD_URL_BASE || 'https://partisipasimuda.org/uploads';
    } else {
      // Use local development paths
      baseUploadDir = join(process.cwd(), 'public', 'uploads');
      publicUrlBase = '/uploads';
    }

    const uploadDir = join(baseUploadDir, type === 'image' ? 'images' : 'documents');
    
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Upload directory:', uploadDir);
    console.log('Public URL base:', publicUrlBase);
    
    try {
      if (!existsSync(uploadDir)) {
        console.log('Creating upload directory...');
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directory:', error);
      return NextResponse.json({ 
        error: 'Failed to create upload directory. Please check server permissions.' 
      }, { status: 500 });
    }

    // Generate unique filename with sanitized original name
    const timestamp = Date.now();
    const originalName = file.name.toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);
    
    console.log('Saving file to:', filepath);

    try {
      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      console.log('File saved successfully');

      // Set proper file permissions in production
      if (isProduction) {
        const { chmod } = require('fs/promises');
        await chmod(filepath, 0o644);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json({ 
        error: 'Failed to save file. Please check server permissions.' 
      }, { status: 500 });
    }

    // Construct the public URL
    const publicUrl = `${publicUrlBase}/${type === 'image' ? 'images' : 'documents'}/${filename}`;
    console.log('Public URL:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 