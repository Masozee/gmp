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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { ArrowLeft, Save } from 'lucide-react';

interface CareerFormData {
  title: string;
  type: 'internship' | 'full-time' | 'part-time' | 'contract' | 'volunteer';
  location: string;
  duration: string;
  deadline: string;
  postedDate: string;
  poster: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  applyUrl: string;
  slug: string;
  isActive: boolean;
}

const typeOptions = [
  { value: 'internship', label: 'Magang' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'volunteer', label: 'Relawan' },
];

export default function CreateCareerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CareerFormData>({
    title: '',
    type: 'internship',
    location: '',
    duration: '',
    deadline: '',
    postedDate: new Date().toISOString().split('T')[0], // Today's date
    poster: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    applyUrl: '',
    slug: '',
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
  const handleInputChange = (field: keyof CareerFormData, value: string | boolean) => {
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
      alert('Judul lowongan harus diisi');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Deskripsi lowongan harus diisi');
      return;
    }

    if (!formData.postedDate) {
      alert('Tanggal posting harus diisi');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/karir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create career');
      }

      // Redirect to careers list
      router.push('/admin/karir');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create career');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/karir">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tambah Lowongan Baru</h1>
          <p className="text-muted-foreground">
            Buat lowongan pekerjaan atau magang baru
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Lowongan</CardTitle>
          <CardDescription>
            Lengkapi informasi lowongan yang akan dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Lowongan *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Masukkan judul lowongan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Pekerjaan *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as CareerFormData['type'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe pekerjaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                URL: /karir/{formData.slug || 'slug-lowongan'}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <WysiwygEditor
                label="Deskripsi Lowongan *"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Deskripsi lengkap tentang lowongan"
                height={200}
              />
            </div>

            {/* Location and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Lokasi pekerjaan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Durasi pekerjaan (misal: 3 bulan, 1 tahun)"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postedDate">Tanggal Posting *</Label>
                <Input
                  id="postedDate"
                  type="date"
                  value={formData.postedDate}
                  onChange={(e) => handleInputChange('postedDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>
            </div>

            {/* Poster */}
            <div className="space-y-2">
              <Label htmlFor="poster">Poster/Pembuat Lowongan</Label>
              <Input
                id="poster"
                value={formData.poster}
                onChange={(e) => handleInputChange('poster', e.target.value)}
                placeholder="Nama pembuat atau departemen"
              />
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <WysiwygEditor
                label="Tanggung Jawab"
                value={formData.responsibilities}
                onChange={(value) => handleInputChange('responsibilities', value)}
                placeholder="Daftar tanggung jawab pekerjaan"
                height={150}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <WysiwygEditor
                label="Persyaratan"
                value={formData.requirements}
                onChange={(value) => handleInputChange('requirements', value)}
                placeholder="Persyaratan yang dibutuhkan"
                height={150}
              />
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <WysiwygEditor
                label="Benefit/Keuntungan"
                value={formData.benefits}
                onChange={(value) => handleInputChange('benefits', value)}
                placeholder="Benefit yang didapatkan"
                height={150}
              />
            </div>

            {/* Apply URL */}
            <div className="space-y-2">
              <Label htmlFor="applyUrl">URL Pendaftaran</Label>
              <Input
                id="applyUrl"
                type="url"
                value={formData.applyUrl}
                onChange={(e) => handleInputChange('applyUrl', e.target.value)}
                placeholder="https://forms.google.com/..."
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Lowongan Aktif</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/karir">
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
                    Simpan Lowongan
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