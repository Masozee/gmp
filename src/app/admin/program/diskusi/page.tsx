'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageSquare,
  Calendar,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink
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

export default function AdminDiskusiPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch discussions
  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/diskusi', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch discussions');
      }

      const data = await response.json();
      setDiscussions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discussions');
    } finally {
      setLoading(false);
    }
  };

  // Delete discussion
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus diskusi ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/diskusi/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete discussion');
      }

      // Refresh the list
      fetchDiscussions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete discussion');
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Filter discussions based on search term
  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (discussion.description && discussion.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Diskusi</h1>
          <p className="text-muted-foreground">
            Kelola topik diskusi dan forum
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/program/diskusi/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Diskusi
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Diskusi ({filteredDiscussions.length})</CardTitle>
          <CardDescription>
            Semua topik diskusi yang telah dibuat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="space-x-2">
                    <Skeleton className="h-8 w-16 inline-block" />
                    <Skeleton className="h-8 w-16 inline-block" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchDiscussions} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          ) : filteredDiscussions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Tidak ada diskusi</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tidak ada diskusi yang sesuai dengan pencarian.' : 'Belum ada diskusi yang dibuat.'}
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link href="/admin/program/diskusi/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Diskusi Pertama
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {discussion.image ? (
                      <img
                        src={discussion.image}
                        alt={discussion.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{discussion.title}</h3>
                        {discussion.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {discussion.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={discussion.isActive ? "default" : "secondary"}>
                          {discussion.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(discussion.date)}
                      </div>
                      <div className="text-xs">
                        Slug: /{discussion.slug}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/program/diskusi/detail/${discussion.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/program/diskusi/edit/${discussion.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/program/diskusi/${discussion.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(discussion.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 