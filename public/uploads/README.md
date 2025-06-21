# Uploads Directory

This directory contains uploaded files from the admin panel:

- `images/` - Uploaded images for publications and other content
- `documents/` - Uploaded PDF files and other documents

Files are automatically organized by type and timestamped to prevent conflicts.

## Security Notes

- Only specific file types are allowed (images: jpg, png, gif, webp; documents: pdf)
- File names are sanitized and timestamped
- Maximum file size limits should be configured in production 