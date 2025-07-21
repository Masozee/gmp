"use client"

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="resize-none"
        style={{ minHeight: `${height}px` }}
      />
      <div className="text-xs text-gray-500">
        Tip: Gunakan Markdown untuk formatting. Contoh: **bold**, *italic*, # Heading, - List
      </div>
    </div>
  )
} 