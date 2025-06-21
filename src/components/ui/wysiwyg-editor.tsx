"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Label } from '@/components/ui/label'
import '@uiw/react-md-editor/markdown-editor.css'

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface WysiwygEditorProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
  height?: number
}

export function WysiwygEditor({ 
  value = '', 
  onChange, 
  label, 
  placeholder = 'Tulis konten di sini...',
  className = "",
  height = 300
}: WysiwygEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <Label>{label}</Label>}
        <div 
          className="border rounded-md p-4 bg-gray-50"
          style={{ height: `${height}px` }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading editor...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="edit"
          hideToolbar={false}
          visibleDragbar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.5,
            }
          }}
        />
      </div>
      <div className="text-xs text-gray-500">
        Tip: Gunakan Markdown untuk formatting. Contoh: **bold**, *italic*, # Heading, - List
      </div>
    </div>
  )
} 