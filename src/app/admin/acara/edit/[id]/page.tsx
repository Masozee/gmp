'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  capacity: number;
  image: string | null;
  category: string;
  isPaid: boolean;
  price?: number;
  isRegistrationOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [eventId, setEventId] = useState<string>('');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    date: '',
    time: '',
    location: '',
    address: '',
    capacity: 50,
    imageUrl: '',
    category: '',
    isPaid: false,
    price: 0,
    isRegistrationOpen: true,
  });

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const fetchEvent = async () => {
    if (!eventId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/acara/${eventId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Acara tidak ditemukan');
        } else {
          throw new Error('Failed to fetch event');
        }
        return;
      }

      const data = await response.json();
      setEvent(data);
      
             // Populate form data
       setFormData({
         title: data.title || '',
         description: data.description || '',
         slug: data.slug || '',
         date: data.date || '',
         time: data.time || '',
         location: data.location || '',
         address: data.address || '',
         capacity: data.capacity || 50,
         imageUrl: data.image || '',
         category: data.category || '',
         isPaid: data.isPaid || false,
         price: data.price || 0,
         isRegistrationOpen: data.isRegistrationOpen ?? true,
       });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data acara');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug when title changes
    if (field === 'title') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Judul dan deskripsi harus diisi');
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch(`/api/admin/acara/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      // Redirect to detail page
      router.push(`/admin/acara/detail/${eventId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengupdate acara');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/acara">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Acara</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="mt-4 text-lg font-semibold">
                {error || 'Acara tidak ditemukan'}
              </h3>
              <p className="text-muted-foreground">
                Acara yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/acara">Kembali ke Daftar Acara</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/acara/detail/${eventId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Acara</h1>
            <p className="text-muted-foreground">
              Ubah informasi acara
            </p>
          </div>
        </div>
      </div>

            <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Edit Acara</CardTitle>
            <CardDescription>
              Ubah informasi acara sesuai kebutuhan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="Workshop, Seminar, dll"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Deskripsi lengkap acara"
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="slug-acara"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /acara/{formData.slug}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    placeholder="25 Januari 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Waktu</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    placeholder="09:00 - 17:00 WIB"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Kapasitas</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Nama tempat atau platform online"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap (Opsional)</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Alamat lengkap lokasi acara"
                  rows={2}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRegistrationOpen"
                    checked={formData.isRegistrationOpen}
                    onCheckedChange={(checked) => handleInputChange('isRegistrationOpen', checked)}
                  />
                  <Label htmlFor="isRegistrationOpen">Pendaftaran Dibuka</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => handleInputChange('isPaid', checked)}
                  />
                  <Label htmlFor="isPaid">Acara Berbayar</Label>
                </div>
              </div>

              {formData.isPaid && (
                <div className="space-y-2">
                  <Label htmlFor="price">Harga Tiket (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="100000"
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardContent className="pt-0">
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href={`/admin/acara/detail/${eventId}`}>
                  Batal
                </Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
} 