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
import { FileUpload } from '@/components/ui/file-upload';
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';

interface DiscussionFormData {
  title: string;
  slug: string;
  image: string;
  date: string;
  description: string;
  content: string;
  isActive: boolean;
}

interface EditDiscussionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDiscussionPage({ params }: EditDiscussionPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [discussionId, setDiscussionId] = useState<string>('');
  const [formData, setFormData] = useState<DiscussionFormData>({
    title: '',
    slug: '',
    image: '',
    date: '',
    description: '',
    content: '',
    isActive: true,
  });

  // Get discussion ID from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setDiscussionId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Fetch discussion data
  useEffect(() => {
    if (!discussionId) return;

    const fetchDiscussion = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`/api/admin/diskusi/${discussionId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch discussion');
        }

        const data = await response.json();
        const discussion = data.data;

        setFormData({
          title: discussion.title || '',
          slug: discussion.slug || '',
          image: discussion.image || '',
          date: discussion.date || '',
          description: discussion.description || '',
          content: discussion.content || '',
          isActive: discussion.isActive ?? true,
        });
      } catch (error) {
        console.error('Error fetching discussion:', error);
        alert('Failed to load discussion data');
        router.push('/admin/program/diskusi');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchDiscussion();
  }, [discussionId, router]);

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: discussionId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update discussion');
      }

      // Redirect to discussions list
      router.push('/admin/program/diskusi');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update discussion');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-20" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-32" />
            <Skeleton className="h-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/program/diskusi">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Diskusi</h1>
            <p className="text-muted-foreground">
              Perbarui informasi diskusi
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/program/diskusi/detail/${discussionId}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Detail
            </Link>
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Diskusi</CardTitle>
          <CardDescription>
            Perbarui informasi diskusi yang diperlukan
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
                    Simpan Perubahan
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
