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
import { ArrowLeft, Save } from 'lucide-react';

interface EventFormData {
  title: string;
  description: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationUrl: string;
  imageUrl: string;
  isActive: boolean;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    slug: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    registrationUrl: '',
    imageUrl: '',
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
  const handleInputChange = (field: keyof EventFormData, value: string | number | boolean) => {
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
      alert('Judul acara harus diisi');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Deskripsi acara harus diisi');
      return;
    }

    if (!formData.date) {
      alert('Tanggal acara harus diisi');
      return;
    }

    if (!formData.time) {
      alert('Waktu acara harus diisi');
      return;
    }

    if (!formData.location.trim()) {
      alert('Lokasi acara harus diisi');
      return;
    }

    if (formData.capacity <= 0) {
      alert('Kapasitas harus lebih dari 0');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/acara', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      // Redirect to events list
      router.push('/admin/acara');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/acara">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tambah Acara Baru</h1>
          <p className="text-muted-foreground">
            Buat acara atau event baru untuk organisasi
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Acara</CardTitle>
          <CardDescription>
            Lengkapi informasi acara yang akan dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Acara *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Masukkan judul acara"
                  required
                />
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
                  URL: /acara/{formData.slug || 'slug-acara'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Deskripsi lengkap tentang acara"
                rows={4}
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal Acara *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Waktu Acara *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Lokasi acara"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasitas *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  placeholder="Jumlah peserta maksimal"
                  required
                />
              </div>
            </div>

            {/* Registration URL */}
            <div className="space-y-2">
              <Label htmlFor="registrationUrl">URL Pendaftaran</Label>
              <Input
                id="registrationUrl"
                type="url"
                value={formData.registrationUrl}
                onChange={(e) => handleInputChange('registrationUrl', e.target.value)}
                placeholder="https://forms.google.com/..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Acara</Label>
              <FileUpload
                accept="image/*"
                onChange={(url: string) => handleInputChange('imageUrl', url)}
                value={formData.imageUrl}
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
              <Label htmlFor="isActive">Acara Aktif</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/acara">
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
                    Simpan Acara
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