"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'

interface FileUploadProps {
  type: 'image' | 'pdf'
  value?: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  className?: string
}

export function FileUpload({ 
  type, 
  value, 
  onChange, 
  label, 
  accept,
  className = "" 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultAccept = type === 'image' 
    ? 'image/jpeg,image/jpg,image/png,image/gif,image/webp' 
    : 'application/pdf'

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onChange(result.url)
      } else {
        setUploadError(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept || defaultAccept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : `Upload ${type === 'image' ? 'Image' : 'PDF'}`}
        </Button>

        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {value && (
        <div className="mt-2 p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            {type === 'image' ? (
              <ImageIcon className="h-4 w-4 text-blue-600" />
            ) : (
              <FileText className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {type === 'image' ? 'Image uploaded:' : 'PDF uploaded:'}
            </span>
          </div>
          
          {type === 'image' ? (
            <div className="mt-2">
              <img 
                src={value} 
                alt="Uploaded image" 
                className="max-w-xs max-h-32 object-cover rounded border"
              />
            </div>
          ) : (
            <div className="mt-2">
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View PDF
              </a>
            </div>
          )}
          
          <p className="text-xs text-gray-600 mt-1">
            URL: {value}
          </p>
        </div>
      )}
    </div>
  )
} 