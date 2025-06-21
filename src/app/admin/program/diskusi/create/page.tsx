'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { ArrowLeft, Save } from 'lucide-react';

interface DiscussionFormData {
  title: string;
  slug: string;
  image: string;
  date: string;
  description: string;
  content: string;
  isActive: boolean;
}

export default function CreateDiscussionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DiscussionFormData>({
    title: '',
    slug: '',
    image: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    description: '',
    content: '',
    isActive: true,
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle form input changes
  const handleInputChange = (field: keyof DiscussionFormData, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Judul diskusi harus diisi');
      return;
    }
    
    if (!formData.date) {
      alert('Tanggal diskusi harus diisi');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/diskusi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create discussion');
      }

      // Redirect to discussions list
      router.push('/admin/program/diskusi');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create discussion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/program/diskusi">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tambah Diskusi Baru</h1>
          <p className="text-muted-foreground">
            Buat topik diskusi atau forum baru
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Diskusi</CardTitle>
          <CardDescription>
            Lengkapi informasi diskusi yang akan dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Diskusi *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Masukkan judul diskusi"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="url-friendly-slug"
              />
              <p className="text-xs text-muted-foreground">
                URL: /program/diskusi/{formData.slug || 'slug-diskusi'}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Deskripsi singkat tentang diskusi"
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <WysiwygEditor
                label="Konten Diskusi"
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Konten lengkap diskusi"
                height={300}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Diskusi</Label>
              <FileUpload
                accept="image/*"
                onChange={(url: string) => handleInputChange('image', url)}
                value={formData.image}
                type="image"
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Diskusi Aktif</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/program/diskusi">
                  Batal
                </Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Diskusi
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 