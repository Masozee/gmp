'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar,
  MessageSquare,
  Globe
} from 'lucide-react';

interface Discussion {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  date: string;
  description: string | null;
  content: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DetailDiscussionPageProps {
  params: Promise<{ id: string }>;
}

export default function DetailDiscussionPage({ params }: DetailDiscussionPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [discussionId, setDiscussionId] = useState<string>('');

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
        setLoading(true);
        const response = await fetch(`/api/admin/diskusi/${discussionId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch discussion');
        }

        const data = await response.json();
        setDiscussion(data.data);
      } catch (error) {
        console.error('Error fetching discussion:', error);
        alert('Failed to load discussion data');
        router.push('/admin/program/diskusi');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [discussionId, router]);

  // Delete discussion
  const handleDelete = async () => {
    if (!discussion || !confirm('Apakah Anda yakin ingin menghapus diskusi ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/diskusi/${discussion.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete discussion');
      }

      // Redirect to discussions list
      router.push('/admin/program/diskusi');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete discussion');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-20" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Diskusi tidak ditemukan</h3>
          <p className="text-muted-foreground">
            Diskusi yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/program/diskusi">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Link>
          </Button>
        </div>
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
            <h1 className="text-3xl font-bold">Detail Diskusi</h1>
            <p className="text-muted-foreground">
              Informasi lengkap tentang diskusi
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/program/diskusi/${discussion.slug}`} target="_blank">
              <Globe className="mr-2 h-4 w-4" />
              Lihat Publik
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/program/diskusi/edit/${discussion.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Discussion Information */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{discussion.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(discussion.date)}
                  </div>
                  <div>
                    ID: #{discussion.id}
                  </div>
                </div>
              </div>
              <Badge variant={discussion.isActive ? "default" : "secondary"}>
                {discussion.isActive ? "Aktif" : "Tidak Aktif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Slug URL</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  /program/diskusi/{discussion.slug}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">
                  {discussion.isActive ? "Aktif - Ditampilkan di website" : "Tidak Aktif - Disembunyikan dari website"}
                </p>
              </div>
            </div>

            {/* Image */}
            {discussion.image && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gambar</label>
                <div className="mt-2">
                  <img
                    src={discussion.image}
                    alt={discussion.title}
                    className="max-w-md rounded-lg border"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {discussion.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{discussion.description}</p>
              </div>
            )}

            {/* Content */}
            {discussion.content && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Konten</label>
                <div 
                  className="mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: discussion.content }}
                />
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong>Dibuat:</strong> {formatDateTime(discussion.createdAt)}
                </div>
                <div>
                  <strong>Diperbarui:</strong> {formatDateTime(discussion.updatedAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 